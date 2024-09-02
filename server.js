const express = require('express');
const https = require('https');

const app = express();
const PORT = 3000;

// Function to fetch HTML from Time.com
function fetchHTML(url, callback) {
  https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      callback(data);
    });
  }).on('error', (err) => {
    console.error('Error fetching the page:', err.message);
    callback(null);
  });
}

// Function to extract the latest 6 stories from the HTML content
function extractStories(html) {
  const stories = [];
  let startIndex = 0;

  const feedStart = html.indexOf('<div class="partial latest-stories"');
  if (feedStart === -1) {
    console.error('Failed to find the Latest Stories section.');
    return stories;
  }

  const feedEnd = html.indexOf('</ul>', feedStart);
  const feedHTML = html.substring(feedStart, feedEnd);

  while (stories.length < 6) {
    startIndex = feedHTML.indexOf('<li class="latest-stories__item"', startIndex);
    if (startIndex === -1) break;

    const linkStart = feedHTML.indexOf('href="', startIndex) + 6;
    const linkEnd = feedHTML.indexOf('"', linkStart);
    const link = feedHTML.substring(linkStart, linkEnd);

    const titleStart = feedHTML.indexOf('<h3 class="latest-stories__item-headline">', linkEnd);
    const titleTagStart = feedHTML.indexOf('>', titleStart) + 1;
    const titleEnd = feedHTML.indexOf('</h3>', titleTagStart);
    const title = feedHTML.substring(titleTagStart, titleEnd).trim();

    if (title && link) {
      stories.push({ title, link: `https://time.com${link}` });
    }

    startIndex = linkEnd;
  }

  return stories;
}

// GET endpoint to fetch the latest stories
app.get('/getTimeStories', (req, res) => {
  fetchHTML('https://time.com', (html) => {
    if (html) {
      const latestStories = extractStories(html);
      if (latestStories.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(latestStories, null, 2)); // Pretty-print JSON with 2-space indentation
      } else {
        res.status(404).json({ message: 'No stories found.' });
      }
    } else {
      res.status(500).json({ message: 'Failed to fetch or parse stories.' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/getTimeStories`);
});
