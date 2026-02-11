import { generateBlogHandler } from './src/handlers/apiHandler.js';

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { youtubeUrl, geminiApiKey } = body;

    if (!youtubeUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'youtubeUrl is required' })
      };
    }

    if (!geminiApiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'geminiApiKey is required' })
      };
    }

    const result = await generateBlogHandler(youtubeUrl, geminiApiKey);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
