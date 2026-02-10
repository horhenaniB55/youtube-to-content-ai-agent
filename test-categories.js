import 'dotenv/config';
import { generateBlogHandler } from './src/handlers/apiHandler.js';

// Test videos for different categories
const testVideos = {
  tutorial: 'https://www.youtube.com/watch?v=kN1Czs0m1SU', // Programming tutorial
  review: 'https://www.youtube.com/watch?v=8UVNT4wvIGY', // Product review
  educational: 'https://www.youtube.com/watch?v=wJa5Ch0O4BI', // Educational content
  news: 'https://www.youtube.com/watch?v=qp0HIF3SfI4', // News video
  entertainment: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Entertainment (Rick Astley)
};

const category = process.argv[2] || 'entertainment';
const testUrl = testVideos[category];
const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!geminiApiKey) {
  console.error('❌ Error: GOOGLE_GENERATIVE_AI_API_KEY not found in .env');
  process.exit(1);
}

if (!testUrl) {
  console.error(`Invalid category: ${category}`);
  console.log('Available categories:', Object.keys(testVideos).join(', '));
  process.exit(1);
}

console.log(`🚀 Testing ${category.toUpperCase()} category...\n`);
console.log('Video URL:', testUrl);
console.log('---\n');

try {
  const result = await generateBlogHandler(testUrl, geminiApiKey);
  
  console.log('✅ Success!\n');
  console.log('Video ID:', result.videoId);
  console.log('Category:', result.category);
  console.log('Cached:', result.cached);
  console.log('\n--- Category Content Preview ---');
  console.log(JSON.stringify(result.metadata, null, 2).substring(0, 300) + '...');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
