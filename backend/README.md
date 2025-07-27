# Chopped Backend API

Backend server for the Chopped mobile app that provides image analysis using OpenAI GPT-4 Vision.

## Features

- Image upload and analysis endpoint
- OpenAI GPT-4 Vision integration
- Automatic file cleanup
- CORS support for mobile app
- Health check endpoint

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

3. **Get OpenAI API Key:**
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Create an API key in your dashboard
   - Add it to the `.env` file

## Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST /analyze
Upload and analyze images for Chop Score calculation.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `images`: Array of image files (2-4 images)
  - `imageTypes`: Array of image types (front, side, body)

**Response:**
```json
{
  "score": 78,
  "breakdown": {
    "face": 18,
    "hair": 16,
    "skin": 15,
    "style": 14,
    "body": 15
  },
  "suggestions": {
    "face": "Great facial symmetry! Consider a hairstyle that adds height...",
    "hair": "A fade haircut or short textured sides would enhance...",
    "skin": "Your skin looks healthy. Consider a gentle exfoliator...",
    "style": "Opt for more structured fits on top to broaden...",
    "body": "Improving posture would make your silhouette stronger..."
  }
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## File Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── README.md         # This file
├── uploads/          # Temporary upload directory (auto-created)
└── .env              # Environment variables (create this)
```

## Security Notes

- Images are automatically deleted after analysis
- File size limit: 10MB per image
- Only image files are accepted
- CORS is enabled for mobile app development

## Error Handling

The server includes comprehensive error handling:
- Invalid file types
- Missing images
- OpenAI API errors
- File system errors

All errors return appropriate HTTP status codes and error messages.