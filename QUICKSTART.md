# Quick Start Guide

## 1. Initial Setup

```bash
# Install Node dependencies
npm install

# Build the React app
npm run build
```

## 2. Run the Application

### Option A: Development (recommended for testing)
```bash
# Terminal 1 - React dev server
npm run dev

# Terminal 2 - Flask backend
python server.py
```

Access the app at:
- Development: `http://localhost:3000`
- Backend: `http://localhost:5500`

### Option B: Production
```bash
npm run build
python server.py
```

Access at `http://localhost:5500`

## 3. First Game

1. Open the app in a browser
2. Enter player names and join (up to 4 players)
3. Host sets number of rounds and clicks "ROZPOCZNIJ GRĘ" (START GAME)
4. Players select answers as questions appear
5. After last question, results screen shows

## Key Files Reference

- **React Components**: `src/components/` - All UI screens
- **Game Logic**: `src/context/GameContext.jsx` - Central state management
- **Styling**: `src/styles/` - All CSS files
- **Backend**: `server.py` - Flask + Socket.IO
- **Questions**: `all_questions.py` - Edit to customize

## Customization

### Add/Change Questions
Edit `all_questions.py`:
```python
questions = [
    {
        "question": "Your question here?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct_answer": "Option 1"
    },
    # Add more questions...
]
```

### Change App Port
In `vite.config.js`:
```javascript
server: {
    port: 3000,  // Change this
    // ...
}
```

In `server.py`:
```python
socketio.run(app, port=5500, ...)  # Change this
```

### Customize Styling
Edit CSS files in `src/styles/` - main colors are in `index.css`

## Deployment (Windows/Linux/Mac)

### Windows
```powershell
# PowerShell
npm install
npm run build
python server.py
```

### Linux/Mac
```bash
npm install
npm run build
python3 server.py
```

Then access via your machine's IP address (e.g., `http://192.168.1.100:5500`)

## Mobile/Network Play

If playing over a network:
1. Find your machine's IP: `ipconfig` (Windows) or `ifconfig` (Linux/Mac)
2. Players join at `http://<your-ip>:5500`
3. Make sure port 5500 is accessible on your network

## Debugging Tips

- Open browser DevTools (F12) to see console logs
- Check Flask server terminal for backend errors
- Enable Socket.IO debug: `localStorage.debug = '*'` in browser console

## Common Issues

**"Cannot find dist folder"**
- Run `npm run build` first

**"Port 5500 already in use"**
- Change port in `server.py` and `GameContext.jsx`

**"Players not connecting"**
- Check Flask server is running
- Verify port is accessible
- Try on same machine first, then network

Enjoy your party quiz! 🎉
