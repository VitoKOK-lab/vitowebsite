import type { MetadataRoute } from 'next';
import { dealerServices } from './introduce/service-data';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://luxkey.com.tw/', changeFrequency: 'monthly', priority: 1 },
    { url: 'https://luxkey.com.tw/introduce/', changeFrequency: 'monthly', priority: 0.7 },
    ...dealerServices.map(service => ({ url: `https://luxkey.com.tw/introduce/${service.slug}/`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    { url: 'https://luxkey.com.tw/privacy/', changeFrequency: 'yearly', priority: 0.2 },
  ];
}
