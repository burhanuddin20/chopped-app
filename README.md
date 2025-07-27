# Chopped - Mobile App

A React Native mobile app that analyzes user photos and provides personalized appearance improvement suggestions with a "Chop Score" (0-100). Features a **freemium model** with free and premium subscription tiers.

## 🎯 Features

### ✅ Completed Implementation

1. **Freemium Model**
   - **Free Tier**: Basic analysis with limited features
   - **Premium Tier**: Advanced insights and unlimited usage
   - User subscription management and tracking
   - Usage limits and upgrade prompts

2. **Image Upload Flow**
   - Upload 2-4 photos (front face, side profile, full body)
   - Image preview and removal
   - Progress tracking with tier-based limits
   - Loading states during analysis

3. **Backend API**
   - Node.js Express server with freemium support
   - OpenAI GPT-4 Vision integration
   - Image processing with tier-based restrictions
   - Automatic file cleanup
   - CORS support

4. **Analysis & Scoring**
   - Chop Score (0-100) calculation
   - Breakdown by category:
     - Face Harmony (25 points)
     - Hair & Beard (25 points)
     - Skin (20 points)
     - Outfit & Style (20 points)
     - Posture & Body (20 points)
   - Personalized improvement suggestions
   - **Premium**: Detailed insights and product recommendations

5. **Results Display**
   - Overall score with emoji indicators
   - Category breakdown with progress bars
   - Detailed feedback for each section
   - **Premium**: Product recommendations, style trends, professional tips
   - Save results to history

## 💎 Freemium Tiers

### 📱 Free Tier
- **Price**: $0/month
- **Analyses**: 3 per month
- **Images per analysis**: 2 maximum
- **File size limit**: 5MB per image
- **Features**:
  - ✅ Basic analysis and scoring
  - ❌ Detailed suggestions
  - ❌ Progress tracking
  - ❌ Export results
  - ❌ Priority processing

### 🌟 Premium Tier
- **Price**: $9.99/month
- **Analyses**: 50 per month
- **Images per analysis**: 4 maximum
- **File size limit**: 10MB per image
- **Features**:
  - ✅ Basic analysis and scoring
  - ✅ Detailed suggestions
  - ✅ Progress tracking
  - ✅ Export results
  - ✅ Priority processing
  - ✅ Product recommendations
  - ✅ Style trends analysis
  - ✅ Professional tips
  - ✅ Improvement timeline

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
- User subscription status display
- Usage tracking and limits
- Tier-based image upload limits
- Upgrade prompts when limits reached
- Tips for best results

### 2. Analysis Process
- Loading screen during processing
- Images sent to backend API
- OpenAI GPT-4 Vision analysis
- Tier-based feature access
- Score calculation and breakdown

### 3. Results Screen
- Overall Chop Score (0-100)
- Category breakdown with progress bars
- Suggestion previews
- **Premium**: Detailed insights and recommendations
- Upgrade CTAs for free users
- Save results option

### 4. Upgrade Screen
- Plan comparison
- Feature breakdown
- Upgrade functionality
- FAQ section

### 5. Feedback Screen
- Detailed analysis per category
- Specific improvement suggestions
- Pro tips for each area
- Navigation back to results

## 🏗️ Architecture

### Frontend (React Native + Expo)
```
screens/
├── UploadScreen.tsx      # Image upload with freemium limits
├── ResultsScreen.tsx     # Score display with premium insights
├── UpgradeScreen.tsx     # Subscription management
├── FeedbackScreen.tsx    # Detailed feedback per category
└── ...

services/
├── analysisService.ts    # API integration with freemium support
└── ...

components/
├── Button.tsx           # Reusable button component
├── Card.tsx             # Card container component
└── ...
```

### Backend (Node.js + Express)
```
backend/
├── server.js            # Main server with freemium logic
├── package.json         # Dependencies
├── test.js             # Comprehensive freemium testing
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

- `POST /analyze` - Upload and analyze images (with freemium limits)
- `GET /user/:userId/status` - Get user subscription status
- `POST /user/:userId/upgrade` - Upgrade user subscription
- `GET /plans` - Get available plans and features
- `GET /health` - Health check

## 📊 Data Flow

1. **User Authentication & Status**
   ```
   App starts → Check user status → Display tier limits → Show upgrade options
   ```

2. **Image Upload**
   ```
   User selects photos → Validate tier limits → FormData created → API call → Backend processing
   ```

3. **Analysis**
   ```
   Images received → Check subscription → OpenAI GPT-4 Vision → Tier-based features → Response
   ```

4. **Results**
   ```
   Analysis data → Results screen → Tier-based display → Premium insights → Upgrade prompts
   ```

## 🎨 UI/UX Features

- **Dark theme** with modern design
- **Smooth animations** and transitions
- **Progress indicators** for upload and analysis
- **Tier-based UI** with clear upgrade prompts
- **Error handling** with user-friendly messages
- **Responsive design** for different screen sizes

## 🔒 Security & Privacy

- Images automatically deleted after analysis
- No permanent storage of user photos
- Secure API key handling
- CORS protection
- File size and type validation
- User data privacy protection

## 🧪 Development

### Mock Data
During development, the app uses mock data when the backend is not available:
- Realistic score generation
- Sample suggestions and feedback
- Simulated API delays
- Freemium tier simulation

### Testing
```bash
# Test backend health and freemium features
cd backend && npm test

# Test analysis endpoint (with images)
curl -X POST -F "images=@photo1.jpg" -F "images=@photo2.jpg" \
  -F "imageTypes=front" -F "imageTypes=side" \
  -F "userId=test_user" \
  http://localhost:3000/analyze
```

## 💰 Freemium Implementation Details

### Backend Features
- **User Management**: In-memory user data store with subscription tracking
- **Usage Limits**: Monthly analysis limits and image count restrictions
- **Feature Gating**: Tier-based access to advanced features
- **Upgrade System**: Mock upgrade functionality for testing
- **Premium Analysis**: Enhanced AI prompts for premium users

### Frontend Features
- **Subscription Status**: Real-time display of user tier and usage
- **Limit Enforcement**: UI prevents actions beyond tier limits
- **Upgrade Prompts**: Strategic placement of upgrade CTAs
- **Premium Content**: Exclusive display of premium insights
- **Usage Tracking**: Visual indicators of remaining usage

### API Integration
- **User Identification**: Unique user IDs for tracking
- **Tier Validation**: Server-side enforcement of limits
- **Feature Access**: Conditional feature availability
- **Error Handling**: Graceful handling of limit violations

## 📈 Future Enhancements

- [ ] Real payment processing integration
- [ ] User authentication system
- [ ] Progress tracking over time
- [ ] Social sharing features
- [ ] Advanced image filters
- [ ] Personalized recommendations
- [ ] Integration with styling services
- [ ] Analytics and usage reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including freemium features)
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

**Freemium Model**: Free tier with premium upgrade path for advanced features