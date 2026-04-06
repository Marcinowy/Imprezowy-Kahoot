# Pijacki Kahoot - React Edition

A Flask backend with a modern React frontend for a drinking game quiz application. Originally built for weddings, this is a party game where wrong answers trigger physical punishments (drink penalties).

## Project Structure

```
├── server.py                 # Flask backend with Socket.IO
├── all_questions.py          # Quiz questions database
├── package.json              # Node dependencies
├── vite.config.js           # Vite configuration
├── index.html               # React HTML entry point
└── src/
    ├── main.jsx             # React entry point
    ├── App.jsx              # Main React component
    ├── context/
    │   └── GameContext.jsx   # Global game state management
    ├── components/
    │   ├── JoinGameScreen.jsx
    │   ├── LobbyScreen.jsx
    │   ├── GameScreen.jsx
    │   ├── ScoreboardScreen.jsx
    └── styles/
        ├── index.css
```

## Prerequisites

- **Node.js** (v16+)
- **Python 3.8+**
- **pip** (Python package manager)

## Installation & Setup

### 1. Install Python Dependencies

```bash
pip install flask flask-socketio python-socketio
# If using hardware (RPi GPIO):
pip install RPi.GPIO pigpio
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Build the React App

```bash
npm run build
```

This creates a `dist` folder with the production build. The Flask server will serve this folder.

## Running the Application

### Development Mode

**Terminal 1 - React Dev Server:**
```bash
npm run dev
```
Runs on `http://localhost:3000`

**Terminal 2 - Flask Backend:**
```bash
python server.py
```
Runs on `http://localhost:5500`

In development mode, the React app connects to `http://localhost:5500` for Socket.IO communication.

### Production Mode

```bash
npm run build
python server.py
```

Then visit `http://localhost:5500`

The Flask app serves the built React app from `dist/` folder.

## Features

### Game Screens

1. **Join Game** - Players enter their names and join the lobby
2. **Lobby** - Admin waits for players and sets number of rounds
3. **Game** - Players answer multiple-choice questions
4. **Scoreboard** - Final results with a 3D podium

### Game Flow

1. Players join the game
2. Game host sets number of rounds (1-15)
3. Game starts and questions are displayed
4. Players select answers (fastest to answer wins point)
5. Wrong answers trigger hardware (pump/servo) to pour drinks
6. After all questions, final scoreboard shows winners

### Real-time Features

- Live player list updates
- Socket.IO for real-time communication
- Automatic question transitions
- Player disconnection handling

## Configuration

### Backend

Edit `server.py`:
- **Port**: Change `5500` to your desired port
- **GPIO Pins**: Modify `pumpPowerPIn`, `servoPowerPIn`, `servoSignalPin`, `sensorPins`
- **Pour Settings**: Adjust `repetitions` and `pour_dose`

### Frontend

Edit `src/context/GameContext.jsx`:
- **Server URL**: Update the Socket.IO connection URL if not on localhost:5500

## Available Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build production files to dist/
npm run preview  # Preview production build locally
```

## Hardware Integration

The application controls:
- **Pump Relay** (GPIO 23) - Controls liquid dispensing
- **Servo Relay** (GPIO 24) - Controls servo power
- **Servo Signal** (GPIO 12) - Controls servo position
- **Sensors** (GPIO 25, 8, 7, 1) - Detects shot glasses in slots

The servo rotates to different angles (22.5°, 67.5°, 112.5°, 157.5°) to dispense to each player's slot.

## Technologies Used

- **Frontend**: React 18, Vite, Socket.IO Client
- **Backend**: Flask, Flask-SocketIO
- **Hardware**: RPi.GPIO, pigpio
- **Styling**: CSS3 with responsive design

## Troubleshooting

### Issue: "Cannot GET /"
- Ensure `npm run build` was executed successfully
- Check that `dist/` folder exists with `index.html`

### Issue: Socket.IO connection fails
- Verify Flask server is running on the correct port
- Check CORS settings - currently allows all origins
- In production, update `cors_allowed_origins` in Flask

### Issue: React dev server not connecting to Flask
- Ensure both servers are running
- Check that `http://localhost:5500` is accessible
- Vite proxy is configured in `vite.config.js`

### Issue: HTML/CSS not loading properly
- Clear browser cache
- Check browser console for 404 errors
- Verify static files are in `dist/` folder

## Performance Notes

- The game supports up to 4 players
- Maximum 15 rounds per game
- Optimized for touch screens (mobile-first design)
- 3D podium animation may need GPU acceleration on slow devices

## Future Improvements

- Add player avatars/profiles
- Implement team/group gameplay
- Add quiz categories
- Track game statistics
- Add voice announcements
- Mobile app version

## License

Custom project - modify as needed for your events!

## Support

For issues with:
- **React Components**: Check src/ files and console for errors
- **Socket.IO Communication**: Enable Socket.IO debug with `localStorage.debug = '*'`
- **Hardware Issues**: Check GPIO pin assignments and system permissions
# Imprezowy-Kahoot
