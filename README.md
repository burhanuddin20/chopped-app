# Chopped - AI Appearance Analysis App

A sleek, modern React Native app designed to help users improve their appearance using AI feedback. Built with Expo and TypeScript.

## Features

### 🎯 Core Functionality
- **Photo Upload**: Upload 2-4 photos (front face, side profile, full body)
- **AI Analysis**: Comprehensive appearance analysis with progress tracking
- **Score Dashboard**: Overall "Chopped Score" (0-100) with detailed breakdown
- **Detailed Feedback**: Section-specific feedback with actionable suggestions
- **Progress Tracking**: Historical analysis results and improvement tracking
- **Settings Management**: User profile and app preferences

### 📱 Screens
1. **Welcome Screen**: App introduction with age verification
2. **Photo Upload Screen**: Multi-photo upload with preview and validation
3. **Analysis Progress Screen**: Real-time progress with loading animations
4. **Results Dashboard**: Overall score with section breakdown
5. **Detailed Feedback Screen**: In-depth feedback for each section
6. **History Screen**: Timeline of past analyses and progress
7. **Settings Screen**: User profile and app configuration

### 🎨 Design Features
- **Dark Theme**: Masculine, polished dark theme throughout
- **Modern UI**: Clean, minimalist design with smooth animations
- **Mobile-First**: Optimized for iOS and Android
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Proper contrast and touch targets

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Screen navigation and routing
- **Expo Image Picker**: Photo selection and camera access
- **Linear Gradients**: Visual effects and styling

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chopped-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

### Development Commands

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Build for production
expo build:ios
expo build:android
```

## Project Structure

```
chopped-app/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   ├── Card.tsx        # Card container component
│   └── BottomTabNavigator.tsx
├── screens/            # App screens
│   ├── WelcomeScreen.tsx
│   ├── UploadScreen.tsx
│   ├── AnalysisScreen.tsx
│   ├── ResultsScreen.tsx
│   ├── FeedbackScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── SettingsScreen.tsx
│   └── MainAppScreen.tsx
├── theme/              # Design system
│   └── theme.ts        # Colors, typography, spacing
├── assets/             # Images and static files
├── App.tsx             # Main app component
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## Design System

### Colors
- **Primary**: Dark backgrounds (#1a1a1a, #2d2d2d)
- **Accent**: Cyan blue (#00d4ff) for highlights and CTAs
- **Success**: Green (#00ff88) for positive feedback
- **Warning**: Orange (#ffaa00) for neutral feedback
- **Error**: Red (#ff4444) for negative feedback

### Typography
- **H1**: 32px, bold - Main headings
- **H2**: 24px, bold - Section headings
- **H3**: 20px, semibold - Subsection headings
- **Body**: 16px, normal - Main text
- **Body Small**: 14px, normal - Secondary text
- **Caption**: 12px, normal - Small text

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

## Features in Detail

### Photo Upload
- Supports multiple photo types (front, side, body)
- Image preview with delete/reupload functionality
- Progress tracking and validation
- Tips for best results

### Analysis Process
- Real-time progress animation
- Step-by-step analysis feedback
- Loading states with user engagement

### Results Dashboard
- Overall score with emoji indicators
- Section-by-section breakdown
- Progress bars and percentages
- Quick access to detailed feedback

### Detailed Feedback
- Comprehensive analysis for each section
- Actionable improvement suggestions
- Pro tips and best practices
- Visual progress indicators

### History Tracking
- Timeline of past analyses
- Improvement percentage tracking
- Expandable history items
- Comparison functionality

### Settings & Profile
- User profile management
- Privacy and notification settings
- App preferences and customization
- Account management options

## Future Enhancements

### Backend Integration
- User authentication and profiles
- Cloud storage for photos and results
- Real AI analysis implementation
- Data synchronization

### Advanced Features
- Social sharing of results
- Comparison with friends
- Personalized recommendations
- Progress challenges and goals

### UI/UX Improvements
- Custom animations and transitions
- Advanced theming options
- Accessibility enhancements
- Performance optimizations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a frontend-only implementation. Backend services and AI analysis are not yet integrated and use mock data for demonstration purposes.