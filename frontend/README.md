# YouTube to Blog AI Agent - Frontend

Simple web interface for the YouTube to Blog AI Agent.

## Features

- 🎨 Clean, modern UI with gradient design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔐 Secure API key storage (sessionStorage)
- 📋 Copy to clipboard functionality
- ⚡ Real-time validation
- 🎯 Dual preview (Markdown & HTML)
- ✨ Loading states and error handling

## Quick Start

1. Open `index.html` in your browser
2. Enter your Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
3. Paste a YouTube URL
4. Click "Generate Blog Post"
5. View results in Markdown or HTML preview

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `app.js` - JavaScript logic and API integration

## API Endpoint

```
https://352kso5srd.execute-api.us-east-1.amazonaws.com/prod/generate
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Local Development

Simply open `index.html` in your browser. No build process required!

## Security

- API keys stored in sessionStorage (cleared on tab close)
- HTTPS-only API calls
- Input validation and sanitization

## Screenshots

### Input Form
Clean interface for entering API key and YouTube URL

### Markdown Preview
Raw markdown with syntax highlighting

### HTML Preview
Fully rendered blog post with styling
