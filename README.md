# Chopped - Mobile App

A React Native mobile app that analyzes user photos and provides personalized appearance improvement suggestions with a "Chop Score" (0-100).

## 🎯 Features

### ✅ Completed Implementation

1. **Image Upload Flow**
   - Upload 2-4 photos (front face, side profile, full body)
   - Image preview and removal
   - Progress tracking
   - Loading states during analysis

2. **Backend API**
   - Node.js Express server
   - OpenAI GPT-4 Vision integration
   - Image processing with multer
   - Automatic file cleanup
   - CORS support

3. **Analysis & Scoring**
   - Chop Score (0-100) calculation
   - Breakdown by category:
     - Face Harmony (25 points)
     - Hair & Beard (25 points)
     - Skin (20 points)
     - Outfit & Style (20 points)
     - Posture & Body (20 points)
   - Personalized improvement suggestions

4. **Results Display**
   - Overall score with emoji indicators
   - Category breakdown with progress bars
   - Detailed feedback for each section
   - Save results to history

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Expo CLI
- OpenAI API key

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on device/simulator:**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## 📱 App Flow

### 1. Upload Screen
- Users can upload 2-4 photos
- Three photo types: Front Face, Side Profile, Full Body
- Real-time preview and removal
- Progress tracking (X/4 photos)
- Tips for best results

### 2. Analysis Process
- Loading screen during processing
- Images sent to backend API
- OpenAI GPT-4 Vision analysis
- Score calculation and breakdown

### 3. Results Screen
- Overall Chop Score (0-100)
- Category breakdown with progress bars
- Suggestion previews
- Save results option
- New analysis button

### 4. Feedback Screen
- Detailed analysis per category
- Specific improvement suggestions
- Pro tips for each area
- Navigation back to results

## 🏗️ Architecture

### Frontend (React Native + Expo)
```
screens/
├── UploadScreen.tsx      # Image upload interface
├── ResultsScreen.tsx     # Score display and breakdown
├── FeedbackScreen.tsx    # Detailed feedback per category
└── ...

services/
├── analysisService.ts    # API integration and data handling
└── ...

components/
├── Button.tsx           # Reusable button component
├── Card.tsx             # Card container component
└── ...
```

### Backend (Node.js + Express)
```
backend/
├── server.js            # Main server file
├── package.json         # Dependencies
├── README.md           # Backend documentation
└── uploads/            # Temporary file storage
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env):**
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**Backend (.env):**
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

### API Endpoints

- `POST /analyze` - Upload and analyze images
- `GET /health` - Health check

## 📊 Data Flow

1. **Image Upload**
   ```
   User selects photos → FormData created → API call → Backend processing
   ```

2. **Analysis**
   ```
   Images received → OpenAI GPT-4 Vision → Score calculation → Response
   ```

3. **Results**
   ```
   Analysis data → Results screen → Category breakdown → Detailed feedback
   ```

## 🎨 UI/UX Features

- **Dark theme** with modern design
- **Smooth animations** and transitions
- **Progress indicators** for upload and analysis
- **Error handling** with user-friendly messages
- **Responsive design** for different screen sizes

## 🔒 Security & Privacy

- Images automatically deleted after analysis
- No permanent storage of user photos
- Secure API key handling
- CORS protection
- File size and type validation

## 🧪 Development

### Mock Data
During development, the app uses mock data when the backend is not available:
- Realistic score generation
- Sample suggestions and feedback
- Simulated API delays

### Testing
```bash
# Test backend health
curl http://localhost:3000/health

# Test analysis endpoint (with images)
curl -X POST -F "images=@photo1.jpg" -F "images=@photo2.jpg" \
  -F "imageTypes=front" -F "imageTypes=side" \
  http://localhost:3000/analyze
```

## 📈 Future Enhancements

- [ ] User authentication
- [ ] Progress tracking over time
- [ ] Social sharing features
- [ ] Advanced image filters
- [ ] Personalized recommendations
- [ ] Integration with styling services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details

---

**Built with ❤️ using React Native, Expo, Node.js, and OpenAI**