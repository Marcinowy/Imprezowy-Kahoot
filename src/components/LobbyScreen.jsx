import { useState } from 'react'; // Dodajemy useState
import { useGame } from '../context/GameContext';

export const LobbyScreen = () => {
  const { players, numRounds, startGame } = useGame();
  const [localRounds, setLocalRounds] = useState(numRounds);

  const sortedPlayers = [...players].sort((a, b) => a.id - b.id);

  const handleStart = () => {
    startGame(localRounds);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-[url(/static/background.png)] lg:bg-[url(/static/wide-background.png)] bg-cover bg-center bg-scroll">
      <div className="w-full max-w-3xl relative z-10">
        <div className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl p-6 space-y-2">
          <div className="text-center m-4">
            <h1 className="font-bold text-green-950 text-3xl mb-2 font-corben">
              Poczekaj na resztę!
            </h1>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-lime-900">
            <h2 className="text-2xl font-bold text-lime-900 mb-1 font-corben">Gracze:</h2>
            <div className="grid grid-cols-1 gap-5">
              {sortedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-stone-100 rounded-2xl p-5 shadow-md border-2 border-lime-900"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-lime-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{player.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-lime-900 truncate">{player.username}</p>
                      <p className="text-sm text-lime-700">Gracz #{player.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-base text-red-500 text-center m-4">
              Upewnij się, że wszyscy gracze dołączyli!
            </p>

            <h2 className="text-2xl font-bold text-lime-900 mb-1 font-corben">Liczba rund:</h2>
            <input
              type="number"
              id="numRounds"
              max="15"
              min="1"
              value={localRounds}
              onChange={(e) => setLocalRounds(Math.max(1, Math.min(15, parseInt(e.target.value) || 1)))}
              className="w-full rounded-2xl border-2 border-zinc-300 p-6 transition-all outline-none focus:border-lime-700 focus:shadow-lg focus:shadow-lime-700/20 text-green-950"
            />
          </div>

          <button
            onClick={handleStart}
            className="text-xl font-bold py-4 px-14 m-4 mx-auto block shadow-md border-none rounded-4xl text-white bg-lime-900 cursor-pointer ease-in-out duration-300 font-corben"
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Rozpocznij quiz
          </button>
        </div>
      </div>
    </div>
  );
};