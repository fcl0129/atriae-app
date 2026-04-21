import { getDigestProviderEnv } from "@/lib/env/digests";
import type { DigestModuleKey } from "@/lib/digests/types";

export interface ProviderContext {
  locale: string;
  timezone: string;
  preview: boolean;
  latitude?: number;
  longitude?: number;
}

export interface CalendarSummaryData {
  meetingsCount?: number;
  firstMeetingTime?: string;
  openWindow?: string;
  topEventTitle?: string;
}

export interface WeatherData {
  condition?: string;
  highF?: number;
  lowF?: number;
  precipChance?: number;
}

export interface HeadlinesData {
  headlines: string[];
}

export interface RecommendationData {
  title?: string;
  subtitle?: string;
  reason?: string;
}

export interface ProviderResult<T> {
  data: T | null;
  sourceType: string;
  sourceLabel: string;
  sourceRef?: string;
}

export interface DigestProviders {
  calendar: {
    getSummary(context: ProviderContext): Promise<ProviderResult<CalendarSummaryData>>;
  };
  weather: {
    getForecast(context: ProviderContext): Promise<ProviderResult<WeatherData>>;
  };
  news: {
    getTopHeadlines(context: ProviderContext): Promise<ProviderResult<HeadlinesData>>;
  };
  recommendations: {
    getPick(module: DigestModuleKey, context: ProviderContext): Promise<ProviderResult<RecommendationData>>;
  };
}

const mockProviders: DigestProviders = {
  calendar: {
    async getSummary() {
      return {
        data: { meetingsCount: 4, firstMeetingTime: "9:30 AM", openWindow: "2:00 PM - 3:00 PM", topEventTitle: "Team planning" },
        sourceType: "calendar_mock",
        sourceLabel: "Calendar Snapshot",
      };
    },
  },
  weather: {
    async getForecast() {
      return {
        data: { condition: "Partly cloudy", highF: 68, lowF: 54, precipChance: 15 },
        sourceType: "weather_mock",
        sourceLabel: "Atriae Forecast",
      };
    },
  },
  news: {
    async getTopHeadlines() {
      return {
        data: {
          headlines: [
            "AI infrastructure spending rises as enterprise adoption accelerates.",
            "Global markets open mixed while energy prices stabilize.",
            "Cities expand low-emission transport zones this quarter.",
          ],
        },
        sourceType: "news_mock",
        sourceLabel: "Atriae Wire",
      };
    },
  },
  recommendations: {
    async getPick(module) {
      const map: Partial<Record<DigestModuleKey, RecommendationData>> = {
        culture_pick: { title: "A profile on quiet leadership", subtitle: "Long read", reason: "Thoughtful and practical." },
        series_tip: { title: "Ripley", reason: "Elegant pacing and meticulous tension." },
        music_pick: { title: "Late Night Tales", subtitle: "Khruangbin", reason: "Calm but energizing backdrop." },
        podcast_pick: { title: "The Knowledge Project", subtitle: "Decision quality under pressure", reason: "Strong signal in under 20 minutes." },
      };

      return {
        data: map[module] ?? null,
        sourceType: "recommendation_mock",
        sourceLabel: "Culture Desk",
      };
    },
  },
};

async function getOpenMeteoForecast(context: ProviderContext): Promise<ProviderResult<WeatherData>> {
  if (context.preview || typeof context.latitude !== "number" || typeof context.longitude !== "number") {
    return mockProviders.weather.getForecast(context);
  }

  try {
    const params = new URLSearchParams({
      latitude: String(context.latitude),
      longitude: String(context.longitude),
      daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode",
      forecast_days: "1",
      timezone: context.timezone,
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    if (!response.ok) {
      return mockProviders.weather.getForecast(context);
    }

    const payload = (await response.json()) as {
      daily?: {
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_probability_max?: number[];
      };
    };

    return {
      data: {
        condition: "Forecast available",
        highF: payload.daily?.temperature_2m_max?.[0],
        lowF: payload.daily?.temperature_2m_min?.[0],
        precipChance: payload.daily?.precipitation_probability_max?.[0],
      },
      sourceType: "weather_open_meteo",
      sourceLabel: "Open-Meteo",
      sourceRef: "https://open-meteo.com/",
    };
  } catch {
    return mockProviders.weather.getForecast(context);
  }
}

async function getNewsApiHeadlines(context: ProviderContext): Promise<ProviderResult<HeadlinesData>> {
  const env = getDigestProviderEnv();
  if (context.preview || !env.newsApiKey) {
    return mockProviders.news.getTopHeadlines(context);
  }

  try {
    const response = await fetch("https://newsapi.org/v2/top-headlines?country=us&pageSize=3", {
      headers: { "X-Api-Key": env.newsApiKey },
    });

    if (!response.ok) {
      return mockProviders.news.getTopHeadlines(context);
    }

    const payload = (await response.json()) as { articles?: Array<{ title?: string }> };
    const headlines = (payload.articles ?? []).map((article) => article.title).filter((title): title is string => Boolean(title));

    return {
      data: { headlines },
      sourceType: "news_newsapi",
      sourceLabel: "NewsAPI",
      sourceRef: "https://newsapi.org/",
    };
  } catch {
    return mockProviders.news.getTopHeadlines(context);
  }
}

export function createDigestProviders(): DigestProviders {
  const env = getDigestProviderEnv();

  return {
    calendar: {
      async getSummary(context) {
        if (context.preview || env.calendarProvider === "mock") {
          return mockProviders.calendar.getSummary(context);
        }

        // Integration-ready switch point for Google and Outlook adapters.
        if (env.calendarProvider === "google") {
          return {
            data: null,
            sourceType: "calendar_google_pending",
            sourceLabel: "Google Calendar (pending integration)",
          };
        }

        if (env.calendarProvider === "outlook") {
          return {
            data: null,
            sourceType: "calendar_outlook_pending",
            sourceLabel: "Outlook Calendar (pending integration)",
          };
        }

        return mockProviders.calendar.getSummary(context);
      },
    },
    weather: {
      async getForecast(context) {
        if (env.weatherProvider === "open_meteo") {
          return getOpenMeteoForecast(context);
        }

        return mockProviders.weather.getForecast(context);
      },
    },
    news: {
      async getTopHeadlines(context) {
        if (env.newsProvider === "newsapi") {
          return getNewsApiHeadlines(context);
        }

        return mockProviders.news.getTopHeadlines(context);
      },
    },
    recommendations: {
      async getPick(module, context) {
        // Pluggable switch point for TMDB/Spotify/Listen Notes adapters.
        if (!context.preview && ["tmdb", "spotify", "listen_notes"].includes(env.recommendationProvider)) {
          return {
            data: null,
            sourceType: `recommendation_${env.recommendationProvider}_pending`,
            sourceLabel: `${env.recommendationProvider} (pending integration)`,
          };
        }

        return mockProviders.recommendations.getPick(module, context);
      },
    },
  };
}
