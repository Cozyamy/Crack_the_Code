import { createContext, useContext, useState, useEffect } from 'react';
import { GameMode, Difficulty } from './constants';
import { possibleAnswers as rawPossibleAnswers, allowedGuesses as rawAllowedGuesses } from './wordLists';

// Cleaned versions of the lists
const allowedGuesses = rawAllowedGuesses.map(w => w.trim().toLowerCase());
const possibleAnswers = rawPossibleAnswers.map(w => w.trim().toLowerCase());

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentGame, setCurrentGame] = useState(() => {
    const savedGame = localStorage.getItem('currentGame');
    return savedGame ? JSON.parse(savedGame) : null;
  });

  const [gameStats, setGameStats] = useState(() => {
    const savedStats = localStorage.getItem('gameStats');
    return savedStats
      ? JSON.parse(savedStats)
      : {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
      };
  });

  // Save currentGame to localStorage
  useEffect(() => {
    if (currentGame) {
      localStorage.setItem('currentGame', JSON.stringify(currentGame));
    } else {
      localStorage.removeItem('currentGame');
    }
  }, [currentGame]);

  // Save gameStats to localStorage
  useEffect(() => {
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  }, [gameStats]);

  const isValidGuess = (guess) => {
    if (!guess || guess.length !== 5) return false;
    const normalizedGuess = guess.trim().toLowerCase();
    return allowedGuesses.includes(normalizedGuess);
  };

  // Use the static possibleAnswers list for generating answers
  const generateAnswer = (mode) => {
    if (mode === GameMode.NUMBER) {
      return String(Math.floor(1000 + Math.random() * 9000)); // 4-digit number
    } else if (mode === GameMode.WORD) {
      const randomIndex = Math.floor(Math.random() * possibleAnswers.length);
      return possibleAnswers[randomIndex];
    }
    return '';
  };

  const getAttempts = (difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return 10;
      case Difficulty.MEDIUM:
        return 7;
      case Difficulty.HARD:
        return 5;
      case Difficulty.EXPERT:
      case Difficulty.INSANE:
        return Infinity;
      default:
        return 10;
    }
  };

  const restartGame = () => {
    if (!currentGame) return;

    const newGame = {
      ...currentGame,
      answer: generateAnswer(currentGame.mode),
      attempts: [],
      isWon: false,
      timeStarted: Date.now(),
      timeCompleted: null,
    };

    setCurrentGame(newGame);
  };

  const startGame = (mode, difficulty) => {
    const answer = generateAnswer(mode);
    const maxAttempts = getAttempts(difficulty);

    setCurrentGame({
      mode,
      difficulty,
      answer,
      maxAttempts,
      attempts: [],
      timeStarted: Date.now(),
    });

    console.log(`Game started. Mode: ${mode}, Difficulty: ${difficulty}, Answer: ${answer}`);
  };

  const endGame = (won) => {
    setGameStats((prev) => {
      const updated = {
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + (won ? 1 : 0),
        currentStreak: won ? prev.currentStreak + 1 : 0,
        maxStreak: won ? Math.max(prev.maxStreak, prev.currentStreak + 1) : prev.maxStreak,
      };
      return updated;
    });

    setCurrentGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isWon: won,
        timeCompleted: Date.now(),
        attempts: prev.attempts || [],
      };
    });
  };

  const resetGame = () => {
    setCurrentGame(null);
  };

  return (
    <GameContext.Provider
      value={{
        startGame,
        currentGame,
        setCurrentGame,
        endGame,
        resetGame,
        gameStats,
        restartGame,
        allowedGuesses,
        isValidGuess,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);