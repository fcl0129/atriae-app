import type { DigestModuleKey, ModuleConfig } from "@/lib/digests/types";

export interface DigestModuleDefinition {
  key: DigestModuleKey;
  title: string;
  description: string;
  category: "context" | "planning" | "culture" | "lifestyle" | "custom";
  defaultSettings?: Record<string, unknown>;
  validateSettings?: (settings: Record<string, unknown>) => Record<string, unknown>;
}

export class DigestModuleRegistry {
  private readonly modules = new Map<DigestModuleKey, DigestModuleDefinition>();

  register(definition: DigestModuleDefinition): DigestModuleRegistry {
    this.modules.set(definition.key, definition);
    return this;
  }

  registerMany(definitions: DigestModuleDefinition[]): DigestModuleRegistry {
    definitions.forEach((definition) => this.register(definition));
    return this;
  }

  get(key: DigestModuleKey): DigestModuleDefinition | undefined {
    return this.modules.get(key);
  }

  list(): DigestModuleDefinition[] {
    return [...this.modules.values()];
  }

  resolveConfig(config: ModuleConfig): ModuleConfig {
    const definition = this.get(config.module);

    if (!definition) {
      throw new Error(`Module '${config.module}' is not registered.`);
    }

    const mergedSettings = {
      ...(definition.defaultSettings ?? {}),
      ...(config.settings ?? {}),
    };

    return {
      ...config,
      settings: definition.validateSettings ? definition.validateSettings(mergedSettings) : mergedSettings,
    };
  }
}
