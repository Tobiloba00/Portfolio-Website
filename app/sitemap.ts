import type { MetadataRoute } from 'next';
import { posts } from './blog/posts';

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfolio-website-theta-kohl-xpfw4oztc5.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${siteUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...posts.map((post) => ({
            url: `${siteUrl}/blog/${post.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        })),
    ];
}
