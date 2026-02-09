import { z } from 'zod';

// Category enum
export const CategoryEnum = z.enum([
  'tutorial',
  'review',
  'educational',
  'news',
  'entertainment'
]);

// Category classification schema (Stage 1)
export const CategoryClassificationSchema = z.object({
  category: CategoryEnum,
  confidenceScore: z.number().min(0).max(1),
  reasoning: z.string()
});

// Tutorial blog schema
export const TutorialBlogSchema = z.object({
  prerequisites: z.array(z.string()),
  steps: z.array(z.object({
    title: z.string(),
    description: z.string()
  })),
  keyTakeaways: z.array(z.string())
});

// Review blog schema
export const ReviewBlogSchema = z.object({
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  verdict: z.string(),
  ratingScore: z.number().min(0).max(10)
});

// Educational blog schema
export const EducationalBlogSchema = z.object({
  conceptExplanation: z.string(),
  examples: z.array(z.string()),
  summary: z.string()
});

// News blog schema
export const NewsBlogSchema = z.object({
  context: z.string(),
  mainPoints: z.array(z.string()),
  analysis: z.string(),
  implications: z.string()
});

// Entertainment blog schema
export const EntertainmentBlogSchema = z.object({
  highlights: z.array(z.string()),
  memorableMoments: z.array(z.string()),
  conclusion: z.string()
});

// Base blog schema
export const BaseBlogSchema = z.object({
  videoMetadata: z.object({
    title: z.string(),
    channel: z.string(),
    thumbnailUrl: z.string(),
    publishDate: z.string(),
    viewCount: z.number(),
    duration: z.string()
  }),
  contentSections: z.object({
    introduction: z.string(),
    body: z.string(),
    conclusion: z.string()
  }),
  mediaReferences: z.object({
    thumbnail: z.string(),
    credits: z.string()
  })
});

// Get category-specific schema
export function getCategorySchema(category) {
  const schemas = {
    tutorial: TutorialBlogSchema,
    review: ReviewBlogSchema,
    educational: EducationalBlogSchema,
    news: NewsBlogSchema,
    entertainment: EntertainmentBlogSchema
  };
  return BaseBlogSchema.extend({ categoryContent: schemas[category] });
}
