import { useGame } from '../context/GameContext';
import { useTranslation } from "react-i18next";

export const GameScreen = () => {
  const { currentQuestion, submitAnswer, answered, numRounds } = useGame();
  const { t } = useTranslation();

  if (!currentQuestion) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-[url(/static/background.png)] lg:bg-[url(/static/wide-background.png)] bg-cover bg-center bg-scroll">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-lime-900 border-t-lime-600 mx-auto mb-4"></div>
          <p className="text-green-800 text-2xl font-bold">{t('loadingQuestion')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-[url(/static/background.png)] lg:bg-[url(/static/wide-background.png)] bg-cover bg-center bg-scroll">
      <div className="w-full max-w-4xl relative z-10">
        {/* Question Navigation */}
        <div className="text-center mb-2">
          <div className="flex justify-center gap-2 flex-wrap">
            {Array.from({ length: numRounds }).map((_, i) => (
              <div
                key={i + 1}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition font-corben ${
                  currentQuestion.number === i + 1
                    ? 'bg-lime-900 text-white border-lime-900'
                    : 'bg-white text-lime-700 border-lime-700 hover:border-lime-500'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Question Container */}
        <div className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl p-6 space-y-2">
          <h2 className="text-3xl font-bold text-lime-900 mb-5 leading-snug text-center">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {answered ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-lime-900 border-t-lime-600 mb-6"></div>
                <p className="text-xl font-bold text-lime-700 text-center">{t('waitingForOthers')}</p>
              </div>
            ) : (
              currentQuestion.options.map((option, index) => {
                const letters = ['A', 'B', 'C', 'D'];
                return (
                  <button
                    key={index}
                    onClick={() => submitAnswer(option.id)}
                    className="w-full bg-stone-100 hover:bg-lime-50 border-2 border-lime-900 text-lime-700 rounded-full p-5 text-left text-lg transition transform hover:scale-102 active:scale-95 cursor-pointer shadow-md hover:shadow-lg duration-200 flex items-center gap-5 font-montserrat"
                  >
                    <span className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-lime-700 flex items-center justify-center font-bold text-white text-lg font-corben">
                      {letters[index]}
                    </span>
                    <span className="flex-1">{option.text}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
