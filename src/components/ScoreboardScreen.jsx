import { useGame } from '../context/GameContext';

export const ScoreboardScreen = () => {
  const { players, currentScreen, setCurrentScreen } = useGame();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const topThree = sortedPlayers.slice(0, 3);

  const handleNewGame = () => {
    setCurrentScreen('join');
    window.location.reload();
  };

  const medalEmojis = ['🥇', '🥈', '🥉'];
  const colors = [
    'from-yellow-400 to-yellow-500',
    'from-gray-300 to-gray-400',
    'from-orange-300 to-orange-400'
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-yellow-50 to-green-50 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 opacity-10 text-9xl">🌿</div>
      <div className="absolute bottom-20 left-5 opacity-10 text-9xl">🌾</div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-10 md:p-12 border-2 border-green-100 space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-green-900">
              Wyniki końcowe!
            </h1>
            <p className="text-lg sm:text-xl text-green-700 font-medium">Gratuluję wszystkim uczestnikom!</p>
          </div>

          {/* Podium */}
          <div className="flex justify-center items-end gap-3 md:gap-6 h-80 mt-16 flex-wrap md:flex-nowrap">
            {/* 2nd Place */}
            {topThree.length > 1 && (
              <div className="flex flex-col items-center">
                <div className={`bg-gradient-to-b ${colors[1]} rounded-3xl p-6 w-36 h-44 flex flex-col items-center justify-center mb-4 shadow-lg border-2 border-gray-300`}>
                  <div className="text-5xl mb-3">🥈</div>
                  <p className="text-2xl font-bold text-gray-700">2º</p>
                </div>
                <div className="text-center bg-white rounded-2xl p-5 w-36 shadow-md border-2 border-gray-200">
                  <p className="font-bold text-green-900 text-lg truncate">{topThree[1]?.username || '-'}</p>
                  <p className="text-2xl font-bold text-green-700 mt-2">{topThree[1]?.score || 0}pts</p>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {topThree.length > 0 && (
              <div className="flex flex-col items-center">
                <div className={`bg-gradient-to-b ${colors[0]} rounded-3xl p-8 w-48 h-64 flex flex-col items-center justify-center mb-4 shadow-2xl transform scale-110 border-3 border-yellow-400`}>
                  <div className="text-7xl mb-4">🥇</div>
                  <p className="text-4xl font-bold text-yellow-700">1º</p>
                </div>
                <div className="text-center bg-yellow-50 rounded-2xl p-6 w-48 border-3 border-yellow-300 shadow-lg">
                  <p className="font-bold text-green-900 text-lg truncate">{topThree[0]?.username || '-'}</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{topThree[0]?.score || 0}pts</p>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree.length > 2 && (
              <div className="flex flex-col items-center">
                <div className={`bg-gradient-to-b ${colors[2]} rounded-3xl p-6 w-36 h-40 flex flex-col items-center justify-center mb-4 shadow-lg border-2 border-orange-300`}>
                  <div className="text-5xl mb-3">🥉</div>
                  <p className="text-2xl font-bold text-orange-700">3º</p>
                </div>
                <div className="text-center bg-white rounded-2xl p-5 w-36 shadow-md border-2 border-orange-200">
                  <p className="font-bold text-green-900 text-lg truncate">{topThree[2]?.username || '-'}</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">{topThree[2]?.score || 0}pts</p>
                </div>
              </div>
            )}
          </div>

          {/* Full Rankings */}
          <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-3xl p-8 sm:p-10 md:p-12 mt-16 border-2 border-green-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-8">Pełna punktacja:</h2>
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
                  <span className="ml-4 flex-shrink-0">{player.score} pkt</span>
                </div>
              ))}
            </div>
          </div>

          {/* New Game Button */}
          <button
            onClick={handleNewGame}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-5 md:py-6 px-6 rounded-2xl text-lg md:text-xl transition transform hover:scale-105 active:scale-95 shadow-lg mt-10"
          >
            Nowa gra
          </button>
        </div>
      </div>
    </div>
  );
};
