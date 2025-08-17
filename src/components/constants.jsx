import { Hash, Type, Target, Clock, Zap, Brain } from 'lucide-react';

export const GameMode = {
  NUMBER: 'number',
  WORD: 'word',
};

export const Difficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
  INSANE: 'insane',
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
    description: 'Full feedback with position hints',
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
  {
    id: Difficulty.EXPERT,
    icon: Brain,
    title: 'Expert',
    description: 'Unlimited attempts. Feedback only for correct positions.',
    attempts: Infinity, // Or null/undefined
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
  id: Difficulty.INSANE,
  icon: Brain, // Or choose a new icon if you'd like
  title: 'Insane',
  description: 'Unlimited attempts. no color feedbacks or position hints',
  attempts: Infinity,
  color: 'text-pink-600 dark:text-pink-400',
},
];