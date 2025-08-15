// src/components/constants.js

import { Hash, Type, Target, Clock, Zap } from 'lucide-react';

export const GameMode = {
  NUMBER: 'number',
  WORD: 'word',
};

export const Difficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const gameModes = [
  {
    id: GameMode.NUMBER,
    icon: Hash,
    title: 'Number Mode',
    description: 'Guess a 4-digit number',
    example: 'e.g., 1234',
  },
  {
    id: GameMode.WORD,
    icon: Type,
    title: 'Word Mode',
    description: 'Guess a 5-letter word',
    example: 'e.g., APPLE',
  },
];

export const difficulties = [
  {
    id: Difficulty.EASY,
    icon: Target,
    title: 'Easy',
    description: 'Full feedback with position hints',
    attempts: 10,
    color: 'text-green-600 dark:text-green-400',
  },
  {
    id: Difficulty.MEDIUM,
    icon: Clock,
    title: 'Medium',
    description: 'Partial feedback, no position hints',
    attempts: 7,
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    id: Difficulty.HARD,
    icon: Zap,
    title: 'Hard',
    description: 'Minimal feedback, only correct count',
    attempts: 5,
    color: 'text-red-600 dark:text-red-400',
  },
];