import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trans, useTranslation } from "react-i18next";

export const JoinGameScreen = () => {
  const [username, setUsername] = useState('');
  const { joinGame } = useGame();
  const { t, i18n } = useTranslation();

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
          <p className="text-base text-green-950"> <Trans i18nKey="greetings" /> </p>
        </div>

        <div className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl p-6 space-y-2">
          <input
            type="text"
            placeholder={t("enterUsername")}
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
            {t("joinGame")}
          </button>
        </div>
      </div>
      <div class="inline-flex items-center gap-2 mt-8">
        <label for="language-switch" class="text-slate-600 text-sm cursor-pointer">Polski</label>
      
        <div class="relative inline-block w-11 h-5">
          <input id="language-switch" type="checkbox" onChange={(e) => i18n.changeLanguage(e.target.checked ? 'en' : 'pl')} class="peer appearance-none w-11 h-5 bg-lime-700 rounded-full checked:bg-lime-900 cursor-pointer transition-colors duration-300" />
          <label for="language-switch" class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-lime-750 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-lime-950 cursor-pointer">
          </label>
        </div>
      
        <label for="language-switch" class="text-slate-600 text-sm cursor-pointer">English</label>
      </div>
    </div>
  );
};
