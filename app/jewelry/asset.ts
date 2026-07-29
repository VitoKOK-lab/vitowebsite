/** GitHub Pages 部署時的 basePath 前綴(見 next.config.mjs) */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetUrl(path: string): string {
  return `${BASE_PATH}${path}`;
}
