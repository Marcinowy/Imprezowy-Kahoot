import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useTranslation } from "react-i18next";

export const LobbyScreen = () => {
  const { players, numRounds, startGame, playerId } = useGame();
  const [localRounds, setLocalRounds] = useState(numRounds);
  const [gameMode, setGameMode] = useState('looserMode');
  const { t } = useTranslation();

  const sortedPlayers = [...players].sort((a, b) => a.id - b.id);

  const handleStart = () => {
    startGame(localRounds, gameMode);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-[url(/static/background.webp)] lg:bg-[url(/static/wide-background.webp)] bg-cover bg-center bg-scroll">
      <div className="w-full max-w-3xl relative z-10">
        <div className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl p-4 md:p-6 space-y-2">
          <div className="text-center m-4">
            <h1 className="font-bold text-green-950 text-3xl mb-2 font-corben">
              {t("waitingForPlayers")}
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-green-950 mb-2">{t("players")}:</h2>
          <div className="grid grid-cols-1 gap-5">
            {sortedPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-stone-100 rounded-2xl p-3 sm:p-4 md:p-5 shadow-md border-2 border-lime-900"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-lime-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{player.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-lime-900 truncate">{player.username}</p>
                    <p className="text-sm text-lime-700">{t("player")} #{player.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {playerId === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-green-950 mt-4 mb-2">{t("roundsNumber")}:</h2>
            <input
              type="number"
              id="numRounds"
              max="15"
              min="1"
              value={localRounds}
              onChange={(e) => setLocalRounds(Math.max(1, Math.min(15, parseInt(e.target.value) || 1)))}
              className="w-full rounded-2xl border-2 border-zinc-300 p-3 sm:p-4 md:p-5 transition-all outline-none focus:border-lime-700 focus:shadow-lg focus:shadow-lime-700/20 text-green-950"
            />
            
            <h2 className="text-2xl font-bold text-green-950 mt-4 mb-2">{t("gameMode")}:</h2>
            <div className="flex">
              <button
                onClick={() => setGameMode('looserMode')}
                className={`flex-1 p-2 sm:p-3 rounded-l-xl border-2 font-bold transition-all ${gameMode === 'looserMode' ? 'bg-lime-700 text-white border-lime-700' : 'bg-white text-lime-900 border-zinc-300'}`}
              >
                {t("looserMode")}
              </button>
              <button
                onClick={() => setGameMode('winnerMode')}
                className={`flex-1 p-3 rounded-r-xl border-2 font-bold transition-all ${gameMode === 'winnerMode' ? 'bg-lime-700 text-white border-lime-700' : 'bg-white text-lime-900 border-zinc-300'}`}
              >
                {t("winnerMode")}
              </button>
            </div>

            <button
              onClick={handleStart}
              className="text-xl font-bold py-4 px-14 m-4 mx-auto block shadow-md border-none rounded-4xl text-white bg-lime-900 cursor-pointer ease-in-out duration-300 font-corben"
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {t("startGame")}
            </button>
            
            <p className="text-base text-red-500 text-center m-4">{t("warningBeforeStart")}</p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};