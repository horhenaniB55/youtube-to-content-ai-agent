import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { config } from '../config/settings.js';
import { CategoryClassificationSchema, getCategorySchema } from '../schemas/blogSchemas.js';

// Stage 1: Detect video category
export async function detectCategory(metadata, transcript, geminiApiKey) {
  const google = createGoogleGenerativeAI({ apiKey: geminiApiKey });
  const model = google(config.gemini.model);
  
  const prompt = `Classify this YouTube video into ONE of these categories: tutorial, review, educational, news, or entertainment.

Video Title: ${metadata.title}
Channel: ${metadata.channel}
Description: ${metadata.description}
${transcript ? `Transcript Preview: ${transcript.substring(0, 500)}...` : 'No transcript available'}

Return ONLY these three fields in JSON format:
- category: one of "tutorial", "review", "educational", "news", or "entertainment"
- confidence_score: a number between 0 and 1
- reasoning: brief explanation for your classification`;

  try {
    const result = await generateObject({
      model,
      schema: CategoryClassificationSchema,
      prompt,
      providerOptions: {
        google: { structuredOutputs: false }
      }
    });

    console.log('Category detection:', result.object);
    console.log('Token usage:', result.usage);
    
    return result.object;
  } catch (error) {
    console.error('Error detecting category:', error);
    throw error;
  }
}

// Stage 2: Generate blog content
export async function generateBlogContent(category, metadata, transcript, geminiApiKey) {
  const google = createGoogleGenerativeAI({ apiKey: geminiApiKey });
  const model = google(config.gemini.model);
  
  const categoryPrompts = {
    tutorial: {
      instruction: 'Create a tutorial blog post with prerequisites, step-by-step instructions, and key takeaways.',
      structure: 'prerequisites (array), steps (array of {title, description}), key_takeaways (array)'
    },
    review: {
      instruction: 'Write a review blog post with pros, cons, verdict, and rating.',
      structure: 'pros (array), cons (array), verdict (string), rating_score (number 0-10)'
    },
    educational: {
      instruction: 'Write an educational blog post with concept explanation, examples, and summary.',
      structure: 'concept_explanation (string), examples (array), summary (string)'
    },
    news: {
      instruction: 'Create a news blog post with context, main points, analysis, and implications.',
      structure: 'context (string), main_points (array), analysis (string), implications (string)'
    },
    entertainment: {
      instruction: 'Write an entertainment blog post with highlights, memorable moments, and conclusion.',
      structure: 'highlights (array), memorable_moments (array), conclusion (string)'
    }
  };

  const categoryInfo = categoryPrompts[category] || categoryPrompts.entertainment;

  const prompt = `${categoryInfo.instruction}

Video Title: ${metadata.title}
Channel: ${metadata.channel}
Description: ${metadata.description}
Thumbnail: ${metadata.thumbnailUrl}
Published: ${metadata.publishDate}
Views: ${metadata.viewCount}
Duration: ${metadata.duration}
${transcript ? `Transcript: ${transcript.substring(0, 2000)}...` : 'No transcript available'}

Return a JSON object with:
- videoMetadata: {title, channel, thumbnailUrl, publishDate, viewCount, duration}
- contentSections: {introduction, body, conclusion}
- categoryContent: {${categoryInfo.structure}}
- mediaReferences: {thumbnail, credits}`;

  try {
    const schema = getCategorySchema(category);
    const result = await generateObject({
      model,
      schema,
      prompt,
      temperature: config.gemini.temperature,
      providerOptions: {
        google: { structuredOutputs: false }
      }
    });

    console.log('Blog generation complete');
    console.log('Token usage:', result.usage);
    
    return Array.isArray(result.object) ? result.object[0] : result.object;
  } catch (error) {
    console.error('Error generating blog:', error);
    throw error;
  }
}
