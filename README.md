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
# Edit .env with your configuration
```

3. Required Configuration:
- `GOOGLE_SERVICE_ACCOUNT_KEY_FILE` - Path to Google service account JSON (for YouTube API)
- `AWS_REGION` - AWS region (default: us-east-1)
- `DYNAMO_TABLE_NAME` - DynamoDB table name
- `S3_BUCKET_NAME` - S3 bucket for thumbnails

4. Get Your Gemini API Key:
- Visit: https://aistudio.google.com/app/apikey
- Create a new API key
- **Users provide their own Gemini API key** when calling the API

**Note:** This is a **Bring Your Own Key (BYOK)** system. Users must provide their own Gemini API key for AI generation.

## Live Demo

**Frontend**: http://youtube-blog-frontend-338394181752.s3-website-us-east-1.amazonaws.com

Try it now with your own Gemini API key!

## Usage

### Basic Test
```bash
pnpm test
```

### Test Specific Categories
```bash
# Test tutorial category
pnpm test:tutorial

# Test review category
pnpm test:review

# Test educational category
pnpm test:educational

# Test news category
pnpm test:news

# Test entertainment category
pnpm test:entertainment
```

### Programmatic Usage
```javascript
import { generateBlogHandler } from './src/handlers/apiHandler.js';

const youtubeUrl = 'https://www.youtube.com/watch?v=VIDEO_ID';
const geminiApiKey = 'YOUR_GEMINI_API_KEY'; // User provides their own key

const result = await generateBlogHandler(youtubeUrl, geminiApiKey);
console.log(result.htmlContent);
console.log(result.markdownContent);
```

### API Usage (API Gateway)
```bash
POST https://352kso5srd.execute-api.us-east-1.amazonaws.com/prod/generate
Content-Type: application/json

{
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "geminiApiKey": "YOUR_GEMINI_API_KEY"
}
```

**Example:**
```bash
curl -X POST https://352kso5srd.execute-api.us-east-1.amazonaws.com/prod/generate \
  -H 'Content-Type: application/json' \
  -d '{"youtubeUrl":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","geminiApiKey":"YOUR_KEY"}'
```

## Architecture

- **Vercel AI SDK** - AI agent with Gemini 2.5 Flash
- **Zod** - Schema validation
- **AWS Lambda** - Serverless compute
- **DynamoDB** - Blog storage with 90-day TTL
- **S3** - Thumbnail storage
- **YouTube Data API v3** - Video metadata
- **youtube-transcript** - Caption fetching

## AWS Protection (Portfolio Showcase)

Protect your AWS resources from abuse:

```bash
./aws-protection.sh
```

This configures:
- **Lambda**: Max 5 concurrent executions
- **Budget Alert**: $5/month notification
- **DynamoDB**: On-demand billing (already set)
- **S3**: 90-day auto-delete (already set)

After Lambda deployment, set concurrency limit:
```bash
aws lambda put-function-concurrency \
  --function-name youtube-blog-generator \
  --reserved-concurrent-executions 5 \
  --region us-east-1
```

## Features

- ✅ 5 category types (tutorial, review, educational, news, entertainment)
- ✅ Automatic category detection
- ✅ Structured content generation
- ✅ HTML and Markdown output
- ✅ DynamoDB caching
- ✅ S3 thumbnail storage
- ✅ Free tier optimized
- ✅ BYOK (Bring Your Own Key) model
- ✅ AWS resource protection
