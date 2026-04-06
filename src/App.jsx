import { GameProvider, useGame } from './context/GameContext';
import { JoinGameScreen } from './components/JoinGameScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { GameScreen } from './components/GameScreen';
import { ScoreboardScreen } from './components/ScoreboardScreen';
import { EndGameScreen } from './components/EndGameScreen';
import './styles/index.css';

const GameContent = () => {
  const { currentScreen, joined } = useGame();

  return (
    <div className="main-container w-full h-full">
      {currentScreen === 'join' && <JoinGameScreen />}
      {joined && currentScreen === 'lobby' && <LobbyScreen />}
      {joined && currentScreen === 'game' && <GameScreen />}
      {joined && currentScreen === 'scoreboard' && <ScoreboardScreen />}
      {joined && currentScreen === 'endgame' && <EndGameScreen />}
      {!joined && currentScreen !== 'join' && <JoinGameScreen />}
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
