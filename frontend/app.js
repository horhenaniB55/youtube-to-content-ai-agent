const API_URL = 'https://352kso5srd.execute-api.us-east-1.amazonaws.com/prod/generate';

// Load saved API key on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedKey = sessionStorage.getItem('geminiApiKey');
  if (savedKey) {
    document.getElementById('apiKey').value = savedKey;
  }
});

// Form submission
document.getElementById('blogForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const apiKey = document.getElementById('apiKey').value.trim();
  const youtubeUrl = document.getElementById('youtubeUrl').value.trim();
  
  if (!validateInputs(apiKey, youtubeUrl)) return;
  
  // Save API key
  sessionStorage.setItem('geminiApiKey', apiKey);
  
  await generateBlog(apiKey, youtubeUrl);
});

function validateInputs(apiKey, youtubeUrl) {
  if (!apiKey) {
    showError('Please enter your Gemini API key');
    return false;
  }
  
  if (!youtubeUrl) {
    showError('Please enter a YouTube URL');
    return false;
  }
  
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  if (!youtubeRegex.test(youtubeUrl)) {
    showError('Please enter a valid YouTube URL');
    return false;
  }
  
  return true;
}

async function generateBlog(apiKey, youtubeUrl) {
  const generateBtn = document.getElementById('generateBtn');
  const btnText = generateBtn.querySelector('.btn-text');
  const btnLoader = generateBtn.querySelector('.btn-loader');
  const statusMessage = document.getElementById('statusMessage');
  const outputSection = document.getElementById('outputSection');
  
  // Show loading state
  generateBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-block';
  statusMessage.style.display = 'none';
  outputSection.style.display = 'none';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        youtubeUrl,
        geminiApiKey: apiKey,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate blog post');
    }
    
    displayResults(data);
    showSuccess('Blog post generated successfully!');
    
  } catch (error) {
    showError(error.message);
  } finally {
    // Reset button state
    generateBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
}

function displayResults(data) {
  const outputSection = document.getElementById('outputSection');
  const videoInfo = document.getElementById('videoInfo');
  const htmlContent = document.getElementById('htmlContent');
  
  // Store markdown for copying
  window.markdownContent = data.markdownContent;
  
  // Display video info
  videoInfo.innerHTML = `
    <h3>${data.metadata.title}</h3>
    <p><strong>Channel:</strong> ${data.metadata.channel}</p>
    <p><strong>Views:</strong> ${data.metadata.viewCount.toLocaleString()}</p>
    <p><strong>Duration:</strong> ${data.metadata.duration}</p>
  `;
  
  // Display HTML
  htmlContent.innerHTML = data.htmlContent;
  
  // Show output section
  outputSection.style.display = 'block';
  outputSection.scrollIntoView({ behavior: 'smooth' });
}

function copyMarkdown() {
  const content = window.markdownContent;
  copyToClipboard(content, 'Markdown copied to clipboard!');
}

function copyHTML() {
  const content = document.getElementById('htmlContent').innerHTML;
  copyToClipboard(content, 'HTML copied to clipboard!');
}

function copyToClipboard(text, successMessage) {
  navigator.clipboard.writeText(text).then(() => {
    showSuccess(successMessage);
  }).catch(() => {
    showError('Failed to copy to clipboard');
  });
}

function showError(message) {
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.textContent = message;
  statusMessage.className = 'status-message error';
  statusMessage.style.display = 'block';
  statusMessage.scrollIntoView({ behavior: 'smooth' });
}

function showSuccess(message) {
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.textContent = message;
  statusMessage.className = 'status-message success';
  statusMessage.style.display = 'block';
}
