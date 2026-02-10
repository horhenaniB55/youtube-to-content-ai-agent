import 'dotenv/config';
import { generateBlogHandler } from './src/handlers/apiHandler.js';

// Test with a sample YouTube video
const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!geminiApiKey) {
  console.error('❌ Error: GOOGLE_GENERATIVE_AI_API_KEY not found in .env');
  process.exit(1);
}

console.log('🚀 Testing YouTube to Blog AI Agent...\n');
console.log('Video URL:', testUrl);
console.log('---\n');

try {
  const result = await generateBlogHandler(testUrl, geminiApiKey);
  
  console.log('✅ Success!\n');
  console.log('Video ID:', result.videoId);
  console.log('Blog ID:', result.blogId);
  console.log('Category:', result.category);
  console.log('Cached:', result.cached);
  console.log('\n--- Metadata ---');
  console.log(JSON.stringify(result.metadata, null, 2));
  console.log('\n--- HTML Preview (first 500 chars) ---');
  console.log(result.htmlContent.substring(0, 500) + '...');
  console.log('\n--- Markdown Preview (first 500 chars) ---');
  console.log(result.markdownContent.substring(0, 500) + '...');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
}
