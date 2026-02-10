import { generateBlogHandler } from './src/handlers/apiHandler.js';

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { youtubeUrl, geminiApiKey } = body;

    if (!youtubeUrl) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'youtubeUrl is required' })
      };
    }

    if (!geminiApiKey) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'geminiApiKey is required' })
      };
    }

    const result = await generateBlogHandler(youtubeUrl, geminiApiKey);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
