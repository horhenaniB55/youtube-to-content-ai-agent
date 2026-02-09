export const config = {
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    dynamoTableName: process.env.DYNAMO_TABLE_NAME || 'youtube-blogs',
    s3BucketName: process.env.S3_BUCKET_NAME || 'youtube-blog-assets'
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY
  },
  gemini: {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    model: 'gemini-2.5-flash-latest',
    temperature: 0.7
  }
};
