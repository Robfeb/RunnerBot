# RunnerBot 🏃

**TFC 2014 - Training Tracking Application**

*Aplicación de seguimiento de entrenamientos desarrollada en HTML5 y LungoJS, e integrada en Android mediante PhoneGap.*

RunnerBot is a gamified running and training tracking mobile application for Android. It uses GPS to track your runs, records detailed statistics, and motivates you through game-based challenges.

## ✨ Features

- **GPS Tracking**: Real-time location tracking with distance, speed, and route recording
- **Training Statistics**: Track time, distance, speed, pace, and calories burned
- **Gamification**: Complete challenges and earn points to stay motivated
- **Training History**: Store and review all your past running sessions
- **User Profiles**: Manage personal information and training preferences
- **Audio Feedback**: Text-to-speech notifications during runs (distance milestones, speed updates)
- **Multi-language**: Support for Spanish and English
- **Social Integration**: Share your achievements on Twitter, Facebook, and Google+
- **Offline Support**: Local SQLite database for data persistence

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Modern web standards for mobile interface
- **CSS3**: Responsive styling with Lungo framework
- **JavaScript**: Core application logic and functionality

### Frameworks & Libraries
- **LungoJS**: Mobile UI framework with native-like look and feel
- **QuoJS**: Lightweight JavaScript library for DOM manipulation
- **Google Maps API**: Map integration and geolocation services

### Mobile Platform
- **PhoneGap/Cordova**: Cross-platform mobile development framework
- **Android**: Target platform (minimum SDK 7)

### Data Storage
- **WebSQL/SQLite**: Local database for offline data persistence
- Database schema includes tables for:
  - User profiles
  - Training sessions
  - GPS positions
  - Game challenges
  - Configuration settings
  - Social media integration

## 📁 Project Structure

```
RunnerBot/
├── README.md                    # Project documentation
├── LICENSE                      # Project license
├── rfebrerTFC0114*             # Academic papers and presentations
└── runnerbotApp/               # Main application directory
    ├── config.xml              # PhoneGap/Cordova configuration
    ├── index.html              # Application entry point
    ├── static/                 # Production assets
    │   ├── javascripts/        # Core JavaScript modules
    │   │   ├── app.js         # Main application controller
    │   │   ├── database.js    # Database operations
    │   │   ├── geolocalization.js  # GPS tracking
    │   │   ├── phonegapfn.js  # PhoneGap integration
    │   │   ├── language.js    # Internationalization
    │   │   └── tts.js         # Text-to-speech
    │   ├── stylesheets/       # CSS styles
    │   ├── sections/          # HTML templates for views
    │   └── asides/            # Side menu templates
    ├── www/                   # Development/web version
    ├── components/            # Third-party libraries
    ├── platforms/             # Native platform builds
    │   └── android/           # Android platform files
    ├── plugins/               # Cordova plugins
    └── res/                   # Icons and splash screens
```

## 🚀 Installation

### Prerequisites
- Node.js and npm
- Apache Cordova CLI
- Android SDK (for building Android app)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Robfeb/RunnerBot.git
cd RunnerBot/runnerbotApp
```

2. Install Cordova globally (if not already installed):
```bash
npm install -g cordova
```

3. Add Android platform:
```bash
cordova platform add android
```

4. Install required plugins:
```bash
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-geolocation
cordova plugin add cordova-plugin-media
cordova plugin add cordova-plugin-vibration
```

5. Build the application:
```bash
cordova build android
```

6. Run on device or emulator:
```bash
cordova run android
```

## 💻 Usage

### Starting a Run
1. Open the RunnerBot application
2. Set up your profile (if first time)
3. Select a game/challenge mode (optional)
4. Tap "Start" to begin tracking
5. The app will track your location, distance, and time in real-time

### During a Run
- View real-time statistics (distance, speed, time, calories)
- Receive audio notifications at distance milestones
- Pause or stop the run at any time
- The app continues tracking in the background

### After a Run
- Review your run statistics
- Save the training session to your history
- Share your achievement on social media
- View your route on the map

### Game Modes
RunnerBot includes pre-configured challenge modes with different difficulty levels:
- Various distance goals (3km, 5km, 10km, etc.)
- Time-based challenges
- Speed targets
- Point system for motivation

## ⚙️ Configuration

The application can be configured through:
- **config.xml**: Cordova/PhoneGap settings, permissions, and metadata
- **Database Config Table**: User preferences and application settings
- **Language Files**: Localization strings for ES/EN

### Key Permissions
- Geolocation (GPS tracking)
- Network access (Maps API, social media)
- Storage (SQLite database)
- Media (text-to-speech audio)
- Vibration (notifications)

## 👨‍💻 Author

**Roberto Febrer González**
- Email: febrer@gmail.com
- TFC 2014 Project

## 📄 License

This project is licensed under the terms specified in the LICENSE file.

## 🎓 Academic Context

This application was developed as a Final Degree Project (TFC - Treball Final de Carrera) in 2014. Additional documentation including the project report and presentation can be found in the repository:
- `rfebrerTFC0114memoria.pdf` - Project report
- `rfebrerTFC0114presentació.pdf` - Project presentation

---

*Built with ❤️ using HTML5, LungoJS, and PhoneGap*
