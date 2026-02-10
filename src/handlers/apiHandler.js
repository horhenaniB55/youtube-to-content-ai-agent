import { extractVideoId } from '../utils/validators.js';
import { fetchVideoMetadata, fetchTranscript } from '../services/youtubeService.js';
import { detectCategory, generateBlogContent } from '../services/blogGenerator.js';
import { storeBlog, getBlog, uploadThumbnail } from '../services/storageService.js';
import { generateHTML, generateMarkdown } from '../utils/formatters.js';

// Main handler for blog generation
export async function generateBlogHandler(youtubeUrl, geminiApiKey) {
  try {
    // Validate Gemini API key
    if (!geminiApiKey) {
      throw new Error('Gemini API key is required');
    }

    // Extract video ID
    const videoId = extractVideoId(youtubeUrl);
    console.log('Processing video:', videoId);

    // Check cache
    const cached = await getBlog(videoId);
    if (cached) {
      console.log('Returning cached blog');
      return {
        videoId,
        blogId: cached.blogId,
        htmlContent: cached.htmlContent,
        markdownContent: cached.markdownContent,
        metadata: JSON.parse(cached.metadataJson),
        cached: true
      };
    }

    // Fetch video data
    console.log('Fetching video metadata...');
    const metadata = await fetchVideoMetadata(videoId);
    
    console.log('Fetching transcript...');
    const transcript = await fetchTranscript(videoId);

    // AI processing with user's API key
    console.log('Detecting category...');
    const categoryResult = await detectCategory(metadata, transcript, geminiApiKey);
    
    console.log('Generating blog content...');
    const blogContent = await generateBlogContent(
      categoryResult.category,
      metadata,
      transcript,
      geminiApiKey
    );

    // Upload thumbnail
    console.log('Uploading thumbnail...');
    const s3ThumbnailUrl = await uploadThumbnail(videoId, metadata.thumbnailUrl);

    // Generate formats
    const htmlContent = generateHTML(blogContent);
    const markdownContent = generateMarkdown(blogContent);

    // Store in DynamoDB
    console.log('Storing blog...');
    const stored = await storeBlog(videoId, blogContent, htmlContent, markdownContent);

    return {
      videoId,
      blogId: stored.blogId,
      category: categoryResult.category,
      htmlContent,
      markdownContent,
      metadata,
      cached: false
    };
  } catch (error) {
    console.error('Error in generateBlogHandler:', error);
    throw error;
  }
}

// Lambda handler (for AWS Lambda deployment)
export async function handler(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { youtubeUrl, geminiApiKey } = body;

    if (!youtubeUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'youtubeUrl is required' })
      };
    }

    if (!geminiApiKey) {
      return {
        statusCode: 400,
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
