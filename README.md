
```markdown
# Time Stories API

A Node.js server that fetches and provides the latest 6 stories from Time.com via a REST API.

## Features

- Scrapes latest stories from Time.com
- Provides stories as a JSON response

## Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Access the API**
   Open your browser or API client and go to:
   ```
   http://localhost:3000/getTimeStories
   ```

## Code

- **`fetchHTML(url, callback)`**: Fetches HTML content.
- **`extractStories(html)`**: Extracts latest 6 stories.
- **`/getTimeStories`**: API endpoint returning the stories.

## Error Handling

- **404**: No stories found.
- **500**: Error fetching or parsing stories.
