// Generate HTML from blog object
export function generateHTML(blogData) {
  const { videoMetadata, contentSections, categoryContent } = blogData;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${videoMetadata.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #333; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 20px; }
    .section { margin: 20px 0; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <h1>${videoMetadata.title}</h1>
  <div class="meta">
    <p>Channel: ${videoMetadata.channel} | Views: ${videoMetadata.viewCount.toLocaleString()} | Duration: ${videoMetadata.duration}</p>
    <p>Published: ${new Date(videoMetadata.publishDate).toLocaleDateString()}</p>
  </div>
  <img src="${videoMetadata.thumbnailUrl}" alt="Video thumbnail">
  <div class="section">
    <h2>Introduction</h2>
    <p>${contentSections.introduction}</p>
  </div>
  <div class="section">
    <h2>Content</h2>
    <p>${contentSections.body}</p>
  </div>
  <div class="section">
    <h2>Conclusion</h2>
    <p>${contentSections.conclusion}</p>
  </div>
</body>
</html>`;
}

// Generate Markdown from blog object
export function generateMarkdown(blogData) {
  const { videoMetadata, contentSections } = blogData;
  
  return `# ${videoMetadata.title}

**Channel:** ${videoMetadata.channel}  
**Views:** ${videoMetadata.viewCount.toLocaleString()}  
**Duration:** ${videoMetadata.duration}  
**Published:** ${new Date(videoMetadata.publishDate).toLocaleDateString()}

![Video Thumbnail](${videoMetadata.thumbnailUrl})

## Introduction

${contentSections.introduction}

## Content

${contentSections.body}

## Conclusion

${contentSections.conclusion}

---
*Generated from YouTube video*`;
}
