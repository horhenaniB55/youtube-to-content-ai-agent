import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import { config } from '../config/settings.js';

const dynamoClient = new DynamoDBClient({ region: config.aws.region });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const s3Client = new S3Client({ region: config.aws.region });

// Store blog in DynamoDB
export async function storeBlog(videoId, blogData, htmlContent, markdownContent) {
  const item = {
    videoId,
    blogId: `blog-${videoId}-${Date.now()}`,
    title: blogData.videoMetadata.title,
    category: blogData.categoryContent ? Object.keys(blogData.categoryContent)[0] : 'general',
    htmlContent,
    markdownContent,
    thumbnailUrl: blogData.videoMetadata.thumbnailUrl,
    metadataJson: JSON.stringify(blogData.videoMetadata),
    transcriptAvailable: true,
    createdAt: new Date().toISOString(),
    ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // 90 days
  };

  const command = new PutCommand({
    TableName: config.aws.dynamoTableName,
    Item: item
  });

  await docClient.send(command);
  return item;
}

// Get blog from DynamoDB
export async function getBlog(videoId) {
  const command = new GetCommand({
    TableName: config.aws.dynamoTableName,
    Key: { videoId }
  });

  const response = await docClient.send(command);
  return response.Item;
}

// Upload thumbnail to S3
export async function uploadThumbnail(videoId, thumbnailUrl) {
  try {
    const response = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    const command = new PutObjectCommand({
      Bucket: config.aws.s3BucketName,
      Key: `thumbnails/${videoId}.jpg`,
      Body: buffer,
      ContentType: 'image/jpeg'
    });

    await s3Client.send(command);
    return `https://${config.aws.s3BucketName}.s3.${config.aws.region}.amazonaws.com/thumbnails/${videoId}.jpg`;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    return thumbnailUrl; // Fallback to original URL
  }
}
