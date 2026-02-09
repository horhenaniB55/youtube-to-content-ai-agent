import { youtube } from '@googleapis/youtube';
import { YoutubeTranscript } from 'youtube-transcript';
import { config } from '../config/settings.js';
import { parseDuration } from '../utils/validators.js';

const youtubeClient = youtube({ version: 'v3', auth: config.youtube.apiKey });

// Fetch video metadata from YouTube Data API
export async function fetchVideoMetadata(videoId) {
  try {
    const response = await youtubeClient.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [videoId]
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = response.data.items[0];
    const snippet = video.snippet;
    const statistics = video.statistics;
    const contentDetails = video.contentDetails;

    return {
      title: snippet.title,
      description: snippet.description,
      channel: snippet.channelTitle,
      thumbnailUrl: snippet.thumbnails.high.url,
      publishDate: snippet.publishedAt,
      viewCount: parseInt(statistics.viewCount || 0),
      duration: parseDuration(contentDetails.duration),
      tags: snippet.tags || []
    };
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw error;
  }
}

// Fetch video transcript
export async function fetchTranscript(videoId) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(item => item.text).join(' ');
  } catch (error) {
    console.warn('Transcript not available:', error.message);
    return null;
  }
}
