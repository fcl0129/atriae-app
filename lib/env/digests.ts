export type ProviderMode = "mock" | "google" | "outlook" | "open_meteo" | "newsapi" | "tmdb" | "spotify" | "listen_notes";

export interface DigestProviderEnv {
  calendarProvider: ProviderMode;
  weatherProvider: ProviderMode;
  newsProvider: ProviderMode;
  recommendationProvider: ProviderMode;
  weatherApiKey?: string;
  newsApiKey?: string;
  tmdbApiKey?: string;
  spotifyClientId?: string;
  spotifyClientSecret?: string;
  listenNotesApiKey?: string;
}

export function getDigestProviderEnv(): DigestProviderEnv {
  return {
    calendarProvider: (process.env.DIGEST_CALENDAR_PROVIDER as ProviderMode | undefined) ?? "mock",
    weatherProvider: (process.env.DIGEST_WEATHER_PROVIDER as ProviderMode | undefined) ?? "mock",
    newsProvider: (process.env.DIGEST_NEWS_PROVIDER as ProviderMode | undefined) ?? "mock",
    recommendationProvider: (process.env.DIGEST_RECOMMENDATION_PROVIDER as ProviderMode | undefined) ?? "mock",
    weatherApiKey: process.env.WEATHER_API_KEY,
    newsApiKey: process.env.NEWS_API_KEY,
    tmdbApiKey: process.env.TMDB_API_KEY,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    listenNotesApiKey: process.env.LISTEN_NOTES_API_KEY,
  };
}
