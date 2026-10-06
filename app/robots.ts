import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/team/', '/track/'] }, sitemap: 'https://luxkey.com.tw/sitemap.xml' };
}
