import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      project: z.string(),            // e.g. "veilwrack", "brand"
      medium: z.enum(['image', 'video', 'comic']),
      tools: z.array(z.string()).default([]),
      date: z.coerce.date(),
      image: image(),                 // cover image (required even for video/comic)
      videoUrl: z.string().url().optional(),
    }),
});

export const collections = { gallery };
