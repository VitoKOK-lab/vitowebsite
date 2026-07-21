import type { IndustryKey } from "@/lib/types";
import type { IndustryData } from "./models";
import { buildFactory } from "./seeds/factory";
import { buildEcom } from "./seeds/ecom";
import { buildKitchen } from "./seeds/kitchen";

export type SeedData = Record<IndustryKey, IndustryData>;

export function buildSeed(): SeedData {
  return {
    factory: buildFactory(),
    ecom: buildEcom(),
    kitchen: buildKitchen(),
  };
}
