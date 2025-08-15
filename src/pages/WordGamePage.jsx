// src/pages/WordGamePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useGame } from '../components/GameContext';
import { GameResultModal } from '../components/GameResultModal';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function WordGamePage() {
  const navigate = useNavigate();
  const { currentGame, endGame, setCurrentGame, isValidGuess } = useGame();
  const [validationMessage, setValidationMessage] = useState('');

  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  if (!currentGame || currentGame.mode !== 'word') {
    navigate('/');
    return null;
  }

  const { answer, maxAttempts, difficulty } = currentGame;
  const normalizedDifficulty = difficulty.toUpperCase();
  console.log('Difficulty (raw):', difficulty);
  console.log('Difficulty (normalized):', normalizedDifficulty);

  const handleGuess = () => {
    const normalized = guess.toUpperCase();

    if (normalized.length !== 5 || !/^[A-Z]{5}$/.test(normalized)) {
      setValidationMessage('Please enter a valid 5-letter word.');
      return;
    }

    if (!isValidGuess(normalized)) {
      setValidationMessage('Invalid guess! Word not in allowed list.');
      return;
    }

    // Clear validation message on valid guess
    setValidationMessage('');

    const result = checkWordGuess(normalized, answer, difficulty);
    console.log('Guess result:', result);
    const newGuesses = [...guesses, { guess: normalized, result }];
    setGuesses(newGuesses);
    setGuess('');

    setCurrentGame(prev => ({ ...prev, answer: prev.answer.toUpperCase(), attempts: [...prev.attempts, { guess: normalized, result }], }));


    if (normalized === answer) {
      setIsGameOver(true);
      endGame(true);
    } else if (newGuesses.length >= maxAttempts) {
      setIsGameOver(true);
      endGame(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-400 hover:text-blue-800 font-semibold border rounded-md border-gray-200 dark:border-gray-700 p-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-xl">
            <div className="w-6 h-6 rounded bg-purple-500 text-white flex items-center justify-center font-mono text-xl">
              📝
            </div>
            <span className="text-xl">Word Mode</span>
          </div>
          <div className="mt-1 text-xs text-green-600 dark:text-green-400 border rounded-md border-gray-200 dark:border-gray-700 px-2 py-0.5">
            <span className="uppercase font-mono pr-2">
              {difficulty} -
            </span>
            <span className="font-mono">
              {currentGame.attempts.length} / {maxAttempts} attempts
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsGameOver(false);
            setGuesses([]);
            setGuess('');
          }}
          className="flex items-center gap-1 text-gray-400 hover:text-blue-800 font-semibold border rounded-md border-gray-200 dark:border-gray-700 p-2"
        >
          <RotateCcw className="w-5 h-5" />
          New Game
        </button>
      </div>

      {/* Main Card */}
      <Card>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="mb-2 border rounded-md border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-row justify-between">
              <div className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Progress
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right font-mono">
                {currentGame.attempts.length} / {maxAttempts} Attempts
              </div>
            </div>
            <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded overflow-hidden">
              <div
                className="h-3 bg-purple-600"
                style={{ width: `${(currentGame.attempts.length / maxAttempts) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Guess history */}
          <div className="space-y-2">
            {guesses.map((entry, i) => (
              <div key={i} className="flex flex-wrap gap-2">
                {entry.guess.split('').map((char, j) => {
                  const resultType = entry.result[j];
                  // No need for unknown check anymore
                  const displayChar = char;

                  const baseClass = 'w-10 h-10 flex items-center justify-center font-mono font-bold text-lg border rounded';
                  const colorClass =
                    resultType === 'correct'
                      ? 'bg-green-500 text-white'
                      : resultType === 'misplaced'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-400 text-white'; // fallback for 'absent' or others

                  return (
                    <div key={j} className={`${baseClass} ${colorClass}`}>
                      {displayChar}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Input */}
          {!isGameOver && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuess();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                maxLength="5"
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value.toUpperCase());
                  setValidationMessage('');
                }}
                className="flex-1 p-2 rounded border bg-background text-foreground uppercase"
                placeholder="Enter 5-letter word"
              />
              <Button type="submit">Guess</Button>
            </form>
          )}
          {validationMessage && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
              {validationMessage}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Difficulty Instructions */}
      <Card className="mt-8 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Difficulty Levels</CardTitle>
          <CardDescription>How feedback changes depending on difficulty</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <strong>Easy (10 guesses):</strong>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded border" />
                <span>Correct letter &amp; position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded border" />
                <span>Correct letter, wrong position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded border" />
                <span>Letter not present</span>
              </div>
            </div>
          </div>

          <div>
            <strong>Medium (7 guesses):</strong>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded border" />
                <span>Correct letter &amp; position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded border" />
                <span>Correct letter, wrong position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded border" />
                <span>Letter not present</span>
              </div>
            </div>
          </div>

          <div>
            <strong>Hard (5 guesses):</strong>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded border" />
                <span>Correct letter (position not shown)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded border" />
                <span>Letter not present</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <GameResultModal
        isOpen={isGameOver}
        onClose={() => { }}
        onPlayAgain={() => {
          setIsGameOver(false);
          setGuess('');
          setGuesses([]);
        }}
        onShare={() => {
          alert('Share functionality not implemented yet.');
        }}
      />
    </div>
  );
}

// Word feedback logic (Wordle-style)
function checkWordGuess(guess, answer, difficulty) {
  guess = guess.toUpperCase();
  answer = answer.toUpperCase();

  const result = Array(5).fill('absent');
  const answerArr = answer.split('');
  const used = Array(5).fill(false);

  // First pass: correct letters
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  // Second pass: misplaced letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue;
    const index = answerArr.findIndex((char, j) => char === guess[i] && !used[j]);
    if (index !== -1) {
      result[i] = 'misplaced';
      used[index] = true;
    }
  }

  const mode = (difficulty || 'EASY').toUpperCase();

  if (mode === 'EASY') {
    // Previously EASY behavior (normal)
    return result;
  }

  if (mode === 'MEDIUM') {
    // Previously EASY behavior, so just return normal result (same as EASY)
    return result;
  }

  if (mode === 'HARD') {
    // Previously MEDIUM behavior: convert 'correct' to 'misplaced'
    return result.map(r => (r === 'correct' ? 'misplaced' : r));
  }

  return result;
}