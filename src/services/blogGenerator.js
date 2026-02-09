import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { config } from '../config/settings.js';
import { CategoryClassificationSchema, getCategorySchema } from '../schemas/blogSchemas.js';

const model = google(config.gemini.model);

// Stage 1: Detect video category
export async function detectCategory(metadata, transcript) {
  const prompt = `Analyze this YouTube video and classify it into one of these categories: tutorial, review, educational, news, or entertainment.

Video Title: ${metadata.title}
Channel: ${metadata.channel}
Description: ${metadata.description}
${transcript ? `Transcript Preview: ${transcript.substring(0, 500)}...` : 'No transcript available'}

Provide your classification with confidence score and reasoning.`;

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
export async function generateBlogContent(category, metadata, transcript) {
  const categoryPrompts = {
    tutorial: 'Create a tutorial blog post with clear prerequisites, step-by-step instructions, and key takeaways.',
    review: 'Write a review blog post with pros, cons, a verdict, and a rating score out of 10.',
    educational: 'Write an educational blog post with concept explanations, examples, and a summary.',
    news: 'Create a news blog post with context, main points, analysis, and implications.',
    entertainment: 'Write an entertainment blog post with highlights, memorable moments, and a conclusion.'
  };

  const prompt = `${categoryPrompts[category]}

Video Title: ${metadata.title}
Channel: ${metadata.channel}
Description: ${metadata.description}
${transcript ? `Full Transcript: ${transcript}` : 'Generate content based on title and description only.'}

Create engaging blog content with:
- A compelling introduction
- Detailed body content
- A strong conclusion
- Proper media references and credits`;

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
    
    return result.object;
  } catch (error) {
    console.error('Error generating blog:', error);
    throw error;
  }
}
