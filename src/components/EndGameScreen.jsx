import { useGame } from '../context/GameContext';
import { useTranslation } from "react-i18next";

export const EndGameScreen = () => {
  const { players, pouring, correctAnswer, setCurrentScreen, wrongPlayerIds } = useGame();
  const { t } = useTranslation();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const handleNewGame = () => {
    setCurrentScreen('join');
    window.location.reload();
  };

  const medalEmojis = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-[url(/static/background.png)] lg:bg-[url(/static/wide-background.png)] bg-cover bg-center">
      <div className="w-full max-w-3xl">
        <div className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl p-6 space-y-2">
          <div className="text-center m-8 font-corben">
            <h1 className="text-3xl font-bold text-green-950 mb-2">
              {t('gameOver')}
            </h1>
            <p className="text-base text-green-950">
              {t('congratulations')}
            </p>
            <p className="text-base text-green-950 font-montserrat">
              {t('correctAnswer')}: <b>{correctAnswer}</b>
            </p>
          </div>


          {/* Podium */}

          {/* Full Rankings */}
            <div className="space-y-4">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-5 md:p-6 rounded-2xl font-bold text-lg md:text-xl transition transform hover:scale-102 shadow-sm border-2 ${
                    index === 0
                      ? 'bg-yellow-200 text-yellow-900 border-yellow-300'
                      : index === 1
                      ? 'bg-gray-200 text-gray-800 border-gray-300'
                      : index === 2
                      ? 'bg-orange-200 text-orange-900 border-orange-300'
                      : 'bg-white text-green-900 border-green-100'
                  }`}
                >
                  <span className="truncate">{medalEmojis[index] || `${index + 1}.`} {player.username}</span>
                  <span className="ml-4 flex-shrink-0">{wrongPlayerIds.includes(player.id) ? '🫗' : ''} {player.score} {t('points')}</span>
                </div>
              ))}
            </div>

            {/* New Game Button */}
            <button
              onClick={handleNewGame}
              disabled={pouring}
              className="text-xl font-bold py-4 px-14 m-4 mx-auto block shadow-md border-none rounded-4xl text-white bg-lime-900 cursor-pointer ease-in-out duration-300 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50 font-corben"
            >
              {t('newGame')}
            </button>
            {pouring && (
              <div className="text-center">
                <p className="text-base text-red-500"> {t('pouringWarning')} </p>
              </div>
            )}
            {!pouring && (
              <div className="text-center">
                <p className="text-base text-lime-900"> {t('readyToReplay')} </p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};
