# Chopped Backend API

Backend API server for the Chopped mobile app, providing image analysis using OpenAI GPT-4 Vision.

## Features

- Image upload and analysis endpoint
- OpenAI GPT-4 Vision integration
- Automatic file cleanup
- Error handling and fallback to mock data
- CORS enabled for mobile app integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_actual_openai_api_key
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Image Analysis
```
POST /analyze
```
Analyzes uploaded photos and returns Chop Score with breakdown.

**Request:**
- Content-Type: `multipart/form-data`
- Body: 
  - `photos`: Array of image files (2-4 photos)
  - `photoTypes`: Array of photo types (front, side, body)

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
    "face": "Great facial symmetry...",
    "hair": "Your hair style suits you well...",
    "skin": "Good skin condition...",
    "style": "Nice style choices...",
    "body": "Good posture..."
  }
}
```

## File Upload Limits

- Maximum 4 photos per request
- Minimum 2 photos required
- Maximum file size: 10MB per image
- Supported formats: JPEG, PNG, GIF

## Error Handling

The API includes comprehensive error handling:
- Invalid file types
- File size limits
- Missing photos
- OpenAI API failures (falls back to mock data)
- Server errors

## Development

### Running Tests
```bash
npm test
```

### File Structure
```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env.example       # Environment variables template
├── uploads/           # Temporary upload directory (auto-created)
└── README.md          # This file
```

## Security

- Helmet.js for security headers
- CORS configuration
- File type validation
- Automatic file cleanup
- Input validation

## Deployment

The server can be deployed to any Node.js hosting platform:
- Heroku
- Vercel
- Railway
- DigitalOcean
- AWS

Make sure to set the `OPENAI_API_KEY` environment variable in your deployment environment.