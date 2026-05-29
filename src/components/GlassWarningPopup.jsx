import { useTranslation } from "react-i18next";
import { useGame } from '../context/GameContext';

export const GlassWarningPopup = () => {
  const { t } = useTranslation();
  const { playerWithoutGlass } = useGame();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-[url(/static/background.webp)] lg:bg-[url(/static/wide-background.webp)] bg-cover bg-center">
      <div className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl p-6 space-y-2">
        <div className="text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 font-corben">
            {t('player')} #{playerWithoutGlass?.id}
          </h2>
          <p className="text-lg font-montserrat">
            {playerWithoutGlass?.username} {t('noGlass')}
          </p>
          <p className="mt-6 font-montserrat opacity-90">
            {t('waitingForGlass')}
          </p>
        </div>
      </div>
    </div>
  );
};
