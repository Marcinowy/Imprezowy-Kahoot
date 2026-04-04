import { useGame } from '../context/GameContext';
import '../styles/popover.css';

export const PopoverAlert = () => {
  const { showShotglassAlert, shotglassAlertId, showScoreboard, players } = useGame();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  if (!showShotglassAlert && !showScoreboard) {
    return null;
  }

  return (
    <div className={`popover ${showShotglassAlert || showScoreboard ? 'active' : ''}`}>
      <div className="cm-box">
        {showShotglassAlert && (
          <div className="shotglass-alert">
            Gracz o id: {shotglassAlertId} nie dał kieliszka
          </div>
        )}
        {showScoreboard && (
          <div className="scoreboard-alert active">
            <div className="cm-container">
              <div className="cm-text">Punktacja:</div>
              <div className="player-points">
                {sortedPlayers.map((player) => (
                  <p key={player.id}>
                    {player.id}: {player.username} - {player.score}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
