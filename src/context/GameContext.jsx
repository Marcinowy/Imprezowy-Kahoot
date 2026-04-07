import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import i18next from 'i18next';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [joined, setJoined] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('join'); // join, lobby, game, scoreboard
  const [answered, setAnswered] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [numRounds, setNumRounds] = useState(5);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [pouring, setPouring] = useState(false);
  const [language, setLanguage] = useState('pl'); 
  const [wrongPlayerIds, setWrongPlayerIds] = useState([]);

  useEffect(() => {
    const socketIo = io('http://' + window.location.hostname + ':5500', {
      transports: ['websocket', 'polling']
    });

    socketIo.on('connect', () => {
      console.log('[DEBUG] Connected to server');  // DEBUG
    });

    socketIo.on('message', (data) => {
      console.log(data.data);
    });

    socketIo.on('get_id', (data) => {
      console.log('[DEBUG] Received get_id:', data.playerId);  // DEBUG
      setPlayerId(data.playerId);
    });

    socketIo.on('update_players', (data) => {
      setPlayers(data.players);
    });

    socketIo.on('new_question', (data) => {
      setWrongPlayerIds([]);
      setCurrentQuestion({
        question: data.question,
        options: data.options,
        number: data.number
      });
      setQuestionNumber(data.number);
      setAnswered(false);
      setCurrentScreen('game');
    });

    socketIo.on('game_started', (data) => {
      setWrongPlayerIds([]);
      setNumRounds(data.numRounds);
      setGameStarted(true);
      setCurrentScreen('game');
    });

    socketIo.on('game_joined', () => {
      console.log('[DEBUG] Received game_joined');  // DEBUG
      setJoined(true);
      setCurrentScreen('lobby');
    });

    socketIo.on('game_over', (data) => {
      setWrongPlayerIds(data.wrongPlayerIds);
      setAnswered(false);
      setGameOver(true);
      setPouring(true);
      setPlayers(data.players);
      setCorrectAnswer(data.correctAnswer);
      setCurrentScreen('endgame');
    });

    socketIo.on('lobby_full', (data) => {
      alert(data.message);
    });

    socketIo.on('all_players_answered', (data) => {
      setWrongPlayerIds(data.wrongPlayerIds);
      setAnswered(false);
      setCorrectAnswer(data.correctAnswer);
      setPouring(true);
      setCurrentScreen('scoreboard');
    });

    socketIo.on('didnt_drink', (data) => {
      if (joined) {
      }
    });

    socketIo.on('drinks_poured', () => {
      setPouring(false);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const joinGame = useCallback((username) => {
    if (socket && username.trim() !== '') {
      socket.emit('join', { username, language: i18next.resolvedLanguage });
    }
  }, [socket]);

  const startGame = (rounds) => {
    socket.emit('start_game', { numRounds: rounds,});
  };

  const submitAnswer = useCallback((answer) => {
    console.log('[DEBUG] submitAnswer called, playerId=', playerId, 'answered=', answered);  // DEBUG
    if (socket && playerId && !answered) {
      console.log('[DEBUG] Emitting answer:', answer);  // DEBUG
      setAnswered(true);
      socket.emit('answer', { player_id: playerId, answer });
    }
  }, [socket, playerId, answered]);

  const nextQuestion = useCallback(() => {
    socket.emit('next_question');
  }, [socket]);

  const value = {
    playerId,
    players,
    currentQuestion,
    gameStarted,
    joined,
    currentScreen,
    setCurrentScreen,
    answered,
    questionNumber,
    gameOver,
    numRounds,
    setNumRounds,
    joinGame,
    startGame,
    submitAnswer,
    nextQuestion,
    correctAnswer,
    pouring,
    language,
    setLanguage,
    wrongPlayerIds
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
