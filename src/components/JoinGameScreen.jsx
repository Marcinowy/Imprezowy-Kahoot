import { useState } from 'react';
import { useGame } from '../context/GameContext';

export const JoinGameScreen = () => {
  const [username, setUsername] = useState('');
  const { joinGame } = useGame();

  const handleJoin = () => {
    if (username.trim()) {
      joinGame(username);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-[url(/static/background.png)] lg:bg-[url(/static/wide-background.png)] bg-cover bg-center">
      <div className="w-full max-w-3xl">
        <div className="text-center m-8 font-corben">
          <h1 className="font-bold text-green-950 text-3xl mb-2">
            KAHOOT TIME
          </h1>
          <p className="text-base text-green-950">
            Mamy nadzieję, że dobrze się bawisz na naszym weselu!<br />
            Zapraszamy do naszego pijackiego quizu :)
          </p>
        </div>

        <div className="rounded-3xl shadow-xl p-8 sm:p-10 space-y-6 border-2 bg-white border-zinc-300 shadow-md">
          <input
            type="text"
            placeholder="Wpisz swoje imię"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            className="w-full rounded-2xl border-2 border-zinc-300 p-6 transition-all outline-none focus:border-lime-700 focus:shadow-lg focus:shadow-lime-700/20 text-green-950"
            maxLength="25"
          />
          
          <button
            onClick={handleJoin}
            disabled={!username.trim()}
            className="text-xl font-bold py-4 px-14 m-4 mx-auto block shadow-md border-none rounded-4xl text-white bg-lime-900 cursor-pointer ease-in-out duration-300 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50 font-corben"
            onMouseEnter={(e) => !username.trim() || (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Dołącz do gry
          </button>
        </div>
      </div>
    </div>
  );
};
