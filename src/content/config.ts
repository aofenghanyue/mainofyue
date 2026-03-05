import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Markdown 文章集合（支持 LaTeX）
const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        tags: z.array(z.string()),
        pubDate: z.coerce.date(),
        category: z.enum(['poetry', 'reading', 'tech', 'whimsy']),
        summary: z.string().optional(),
    }),
});

// HTML 文章集合（遗留或 AI 生成的纯 HTML）
const legacy = defineCollection({
    loader: glob({ pattern: '**/*.html', base: './src/content/legacy' }),
});

export const collections = { blog, legacy };
