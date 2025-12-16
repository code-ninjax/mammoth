import type { MammothConfig } from "./types";

let config: MammothConfig | undefined;

export function init(userConfig: MammothConfig) {
  config = userConfig;
}

export function getConfig(): MammothConfig {
  if (!config) throw new Error("Mammoth not initialized");
  return config;
}