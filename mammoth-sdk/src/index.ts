import { init } from "./client";
import { store } from "./store";
import { retrieve } from "./retrieve";

export const Mammoth = {
  init,
  store,
  retrieve,
};

export type { MammothConfig, StoreParams } from "./types";