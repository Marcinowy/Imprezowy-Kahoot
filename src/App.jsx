import { GameProvider, useGame } from './context/GameContext';
import { JoinGameScreen } from './components/JoinGameScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { GameScreen } from './components/GameScreen';
import { ScoreboardScreen } from './components/ScoreboardScreen';
import { PopoverAlert } from './components/PopoverAlert';
import './styles/index.css';

const GameContent = () => {
  const { currentScreen } = useGame();

  return (
    <div className="main-container w-full h-full">
      {currentScreen === 'join' && <JoinGameScreen />}
      {currentScreen === 'lobby' && <LobbyScreen />}
      {currentScreen === 'game' && <GameScreen />}
      {currentScreen === 'scoreboard' && <ScoreboardScreen />}
      <PopoverAlert />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
