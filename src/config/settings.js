export const config = {
  aws: {
    region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
    dynamoTableName: process.env.DYNAMO_TABLE_NAME || 'youtube-blogs',
    s3BucketName: process.env.S3_BUCKET_NAME || 'youtube-blog-assets'
  },
  youtube: {
    serviceAccountKeyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || './service-account-key.json'
  },
  gemini: {
    model: 'gemini-3-flash-preview',
    temperature: 0.7
  }
};
