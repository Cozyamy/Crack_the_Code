import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useGame } from '../components/GameContext';
import { GameResultModal } from '../components/GameResultModal';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function WordGamePage() {
  const navigate = useNavigate();
  const { currentGame, endGame, setCurrentGame, isValidGuess, restartGame } = useGame();
  const guesses = currentGame?.attempts || [];
  const [validationMessage, setValidationMessage] = useState('');

  const [guess, setGuess] = useState('');

  const [showMisplaced, setShowMisplaced] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isGameOver = currentGame?.isWon || (currentGame?.maxAttempts !== Infinity && currentGame?.attempts.length >= currentGame?.maxAttempts);

  useEffect(() => {
    if (currentGame && currentGame.mode !== 'word') {
      navigate('/');
    }
  }, [currentGame, navigate]);

  if (!currentGame || currentGame.mode !== 'word') {
    return <p>Loading game...</p>; // or null
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

    const result = checkWordGuess(normalized, answer, difficulty, showMisplaced);
    console.log('Guess result:', result);
    const newGuesses = [...guesses, { guess: normalized, result }];
    setGuess('');

    setCurrentGame(prev => ({
      ...prev,
      attempts: newGuesses,
    }));

    if (normalized === answer) {
      setCurrentGame(prev => ({
        ...prev,
        attempts: newGuesses,
        isWon: true,       // Add this!
        isOver: true       // optional, if you use isOver to track game end
      }));
      endGame(true);
    } else if (newGuesses.length >= maxAttempts) {
      setCurrentGame(prev => ({
        ...prev,
        attempts: newGuesses,
        isWon: false,
        isOver: true
      }));
      endGame(false);
    } else {
      // Just update attempts if game not over yet
      setCurrentGame(prev => ({
        ...prev,
        attempts: newGuesses,
      }));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center sm:px-4 sm:mb-6 mb-12">
        {/* Back Button - left */}
        <div className="absolute left-0 top-0 sm:static">
          <button
            onClick={() => {
              // localStorage.removeItem('isGameOver');
              navigate('/');
            }}
            className="flex items-center gap-1 text-gray-400 hover:text-blue-800 font-semibold border rounded-md border-gray-200 dark:border-gray-700 px-2 py-1 text-sm sm:text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Center: Mode + Difficulty */}
        <div className="mt-12 sm:mt-0 text-center sm:flex-1 sm:flex sm:flex-col sm:items-center">
          <div className="flex justify-center items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-lg sm:text-xl">
            <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center font-mono text-lg sm:text-xl">
              📝
            </div>
            <span>Word Mode</span>
          </div>
          <div className="mt-1 text-xs text-green-600 dark:text-green-400 border rounded-md border-gray-200 dark:border-gray-700 px-2 py-0.5 inline-block">
            <span className="uppercase font-mono pr-2">
              {difficulty} -
            </span>
            <span className="font-mono">
              {currentGame.attempts.length} / {currentGame.maxAttempts} attempts
            </span>
          </div>
        </div>

        {/* New Game Button - right */}
        <div className="absolute right-0 top-0 sm:static">
          <button
            onClick={() => {
              restartGame();
              setGuess('');
            }}
            className="flex items-center gap-1 text-gray-400 hover:text-blue-800 font-semibold border rounded-md border-gray-200 dark:border-gray-700 px-2 py-1 text-sm sm:text-base"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="mb-2 border rounded-md border-gray-200 dark:border-gray-700 p-4">
            {difficulty === 'insane' && (
              <div className="mt-2 text-sm flex items-center gap-2 justify-center">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMisplaced}
                    onChange={(e) => setShowMisplaced(e.target.checked)}
                  />
                  Show Misplaced Feedback
                </label>
              </div>
            )}
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
                className="flex-1 p-1.5 text-sm sm:p-2 sm:text-base rounded border bg-background text-foreground uppercase"
                placeholder="Enter 5-letter word"
              />
              <Button type="submit" className="p-1.5 text-sm sm:p-2 sm:text-base">Guess</Button>
            </form>
          )}
          {validationMessage && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
              {validationMessage}
            </p>
          )}

          {/* Guess history */}
          <div className="space-y-2">
            {[...guesses].reverse().map((entry, i) => (
              <div key={i} className="flex flex-wrap gap-2">
                {(() => {
                  if (entry.result.summary) {
                    return (
                      <div className="flex flex-col">
                        <div className="flex gap-2 mb-1">
                          {entry.guess.split('').map((char, j) => (
                            <div
                              key={j}
                              className="w-10 h-10 flex items-center justify-center font-mono font-bold text-lg border border-gray-300 rounded text-gray-800 dark:text-gray-200 dark:border-gray-600"
                            >
                              {char}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-mono ml-1">
                          {entry.result.correct} letter{entry.result.correct !== 1 ? 's' : ''} in correct position
                          {entry.result.misplaced !== undefined ? `, ${entry.result.misplaced} misplaced` : ''}
                        </div>
                      </div>
                    );
                  }

                  return entry.guess.split('').map((char, j) => {
                    const resultType = entry.result[j];
                    const displayChar = char;

                    const baseClass = 'w-10 h-10 flex items-center justify-center font-mono font-bold text-lg border rounded';
                    const colorClass =
                      resultType === 'correct'
                        ? 'bg-green-500 text-white'
                        : resultType === 'misplaced'
                          ? 'bg-yellow-500 text-white'
                          : resultType === 'none'
                            ? 'bg-transparent border border-gray-400 text-gray-400' // EXPERT mode: no feedback
                            : 'bg-gray-400 text-white'; // default for absent

                    return (
                      <div key={j} className={`${baseClass} ${colorClass}`}>
                        {displayChar}
                      </div>
                    );
                  });
                })()}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Instructions */}
      <Card className="mt-8 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Difficulty Levels</CardTitle>
          <CardDescription>How feedback changes depending on difficulty</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Easy */}
          <div>
            <strong>Easy (10 guesses):</strong>
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full border" />
                <span>Correct letter & position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full border" />
                <span>Correct letter, wrong position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full border" />
                <span>letter not present</span>
              </div>
            </div>
          </div>

          {/* Medium */}
          <div>
            <strong>Medium (7 guesses):</strong>
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full border" />
                <span>Correct letter & position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full border" />
                <span>Correct letter, wrong position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full border" />
                <span>letter not present</span>
              </div>
            </div>
          </div>

          {/* Hard */}
          <div>
            <strong>Hard (5 guesses):</strong>
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full border" />
                <span>Correct letter (position not shown)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full border" />
                <span>letter not present</span>
              </div>
            </div>
          </div>

          {/* Expert */}
          <div>
            <strong>Expert (5 guesses):</strong>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full border" />
                <span>Correct letter only</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                No feedback is given for wrong or misplaced letters.
              </div>
            </div>
          </div>

          {/* Insane */}
          <div>
            <strong>Insane (∞ guesses):</strong>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Summary feedback only:
              <ul className="list-disc list-inside mt-1">
                <li><strong>Correct:</strong> Number of letters in the correct position</li>
                <li><strong>Misplaced:</strong> (Optional) Number of correct letters in the wrong position</li>
              </ul>
              <p className="mt-1">Use the checkbox to toggle misplaced feedback.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <GameResultModal
        isOpen={isGameOver}
        onClose={() => { }}
        onPlayAgain={() => {
          setGuess('');
          setCurrentGame(prev => ({ ...prev, attempts: [] }));
        }}
        onShare={() => {
          alert('Share functionality not implemented yet.');
        }}
      />
    </div>
  );
}

// Word feedback logic (Wordle-style)
function checkWordGuess(guess, answer, difficulty, showMisplaced = true) {
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

  if (mode === 'EASY' || mode === 'MEDIUM') {
    return result;
  }

  if (mode === 'HARD') {
    // Hide position info — convert 'correct' to 'misplaced'
    return result.map(r => (r === 'correct' ? 'misplaced' : r));
  }

  if (mode === 'EXPERT') {
    // Only show correct letters — everything else is 'none'
    return result.map(r => (r === 'correct' ? 'correct' : 'none'));
  }

  if (mode === 'INSANE') {
    const numCorrect = result.filter(r => r === 'correct').length;
    const numMisplaced = result.filter(r => r === 'misplaced').length;
    return {
      summary: true,
      correct: numCorrect,
      misplaced: showMisplaced ? numMisplaced : undefined
    };
  }

  return result;
}