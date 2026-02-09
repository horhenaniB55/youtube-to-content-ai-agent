# YouTube to Blog AI Agent

Convert YouTube videos into structured blog posts using AI.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Required API Keys:
- `YOUTUBE_API_KEY` - YouTube Data API v3 key
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Gemini API key
- `AWS_REGION` - AWS region (default: us-east-1)
- `DYNAMO_TABLE_NAME` - DynamoDB table name
- `S3_BUCKET_NAME` - S3 bucket for thumbnails

## Usage

```javascript
import { generateBlogHandler } from './src/handlers/apiHandler.js';

const result = await generateBlogHandler('https://www.youtube.com/watch?v=VIDEO_ID');
console.log(result.htmlContent);
console.log(result.markdownContent);
```

## Architecture

- **Vercel AI SDK** - AI agent with Gemini 2.5 Flash
- **Zod** - Schema validation
- **AWS Lambda** - Serverless compute
- **DynamoDB** - Blog storage with 90-day TTL
- **S3** - Thumbnail storage
- **YouTube Data API v3** - Video metadata
- **youtube-transcript** - Caption fetching

## Features

- ✅ 5 category types (tutorial, review, educational, news, entertainment)
- ✅ Automatic category detection
- ✅ Structured content generation
- ✅ HTML and Markdown output
- ✅ DynamoDB caching
- ✅ S3 thumbnail storage
- ✅ Free tier optimized
