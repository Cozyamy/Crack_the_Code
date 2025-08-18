import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useGame } from '../components/GameContext';
import { GameResultModal } from '../components/GameResultModal';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function WordGamePage() {
  const inputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const [guess, setGuess] = useState('');

  const { currentGame, endGame, setCurrentGame, restartGame } = useGame();
  const guesses = currentGame?.attempts || [];
  const [showMisplaced, setShowMisplaced] = useState(true);

  const isGameOver =
    currentGame?.isWon ||
    (currentGame?.maxAttempts !== Infinity &&
      currentGame?.attempts.length >= currentGame?.maxAttempts);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' }); // optional but safe
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, []);

  const handleGuess = () => {
  if (guess.length !== 5 || !/^[A-Z]{5}$/.test(guess)) return;

  const normalizedGuess = guess.toLowerCase(); // 🔥 make it lowercase for logic
  const result = checkWordGuess(normalizedGuess, answer, difficulty, showMisplaced);
  const newGuesses = [...guesses, { guess, result }]; // note: keep UI guess in uppercase form

  setGuess('');
  setCurrentGame(prev => ({
    ...prev,
    attempts: [...prev.attempts, { guess, result }], // keep uppercase version for display
  }));

  if (normalizedGuess === answer) {
    endGame(true);
  } else if (newGuesses.length >= currentGame.maxAttempts) {
    endGame(false);
  }
};

  if (!currentGame || currentGame.mode !== 'word') {
  return null;
}

  // localStorage.setItem('gameStatus', JSON.stringify({ isOver: true, outcome: 'win' }));

  const { difficulty, answer } = currentGame;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center sm:px-4 sm:mb-6 mb-12">
        {/* Back Button - left */}
        <div className="absolute left-0 top-0 sm:static">
          <button
            onClick={() => {
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
              // setIsGameOver(false);
              setGuess('');
            }}
            className="flex items-center gap-1 text-gray-400 hover:text-blue-800 font-semibold border rounded-md border-gray-200 dark:border-gray-700 px-2 py-1 text-sm sm:text-base"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
        </div>
      </div>
      <Card>
        <div className="mb-2 border rounded-md border-gray-200 dark:border-gray-700 p-4">
          {/* <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-background sticky top-0 z-10"> */}

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
              {currentGame.attempts.length} / {currentGame.maxAttempts} Attempts
            </div>
          </div>
          <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded overflow-hidden">
            <div
              className="h-3 bg-blue-600"
              style={{
                width: currentGame.maxAttempts === Infinity
                  ? '100%' // or maybe 'auto' or hide bar completely
                  : `${(currentGame.attempts.length / currentGame.maxAttempts) * 100}%`
              }}
            ></div>
          </div>
        </div>
        {!isGameOver && (
          <div className="p-4 border-b bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuess();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                maxLength="5"
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value.toUpperCase());
                }}
                className="flex-1 p-1.5 text-sm sm:p-2 sm:text-base rounded border bg-background text-foreground uppercase"
                placeholder="Enter 5-letter word"
              />
              <Button type="submit" className="p-1.5 text-sm sm:p-2 sm:text-base">
                Guess
              </Button>
            </form>
          </div>
        )}

        <CardContent className="space-y-2" ref={scrollContainerRef}>
          {[...guesses].reverse().map((entry, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="font-mono text-lg">{entry.guess}</div>
              {difficulty === 'insane' && entry.result.summary ? (
                <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {entry.result.correct} letter{entry.result.correct !== 1 ? 's' : ''} in correct position
                  {showMisplaced && `, ${entry.result.misplaced} misplaced`}
                </div>
              ) : (
                <div className="flex gap-1">
                  {entry.result.map((color, j) => {
                    if (difficulty === 'expert' && color !== 'correct') {
                      return (
                        <span
                          key={j}
                          className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent"
                        ></span>
                      );
                    }

                    return (
                      <span
                        key={j}
                        className={`w-4 h-4 rounded-full border ${color === 'correct'
                          ? 'bg-green-500'
                          : color === 'misplaced'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                          }`}
                      ></span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
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
                onClose={() => { /* do nothing or leave empty to prevent modal closing */ }}
                onPlayAgain={() => {
                    // setIsGameOver(false);
                    setGuess('');
                    setCurrentGame(prev => ({ ...prev, attempts: [] }));
                }}
                onShare={() => {
                    // Your share logic here
                    alert('Share functionality not implemented yet.');
                }}
            />
    </div>
  );
}

// Word feedback logic (Wordle-style)
function checkWordGuess(guess, answer, difficulty, showMisplaced) {
  const result = Array(5).fill('absent');
  const answerArray = answer.split('');
  const guessArray = guess.split('');

  // First pass: correct letters
  guessArray.forEach((letter, i) => {
    if (letter === answerArray[i]) {
      result[i] = 'correct';
      answerArray[i] = null;
      guessArray[i] = null;
    }
  });

  if (difficulty === 'insane') {
    const numCorrect = result.filter(r => r === 'correct').length;

    // Count misplaced (correct letter, wrong position)
    const remainingAnswer = answer.split('').filter((_, i) => result[i] !== 'correct');
    const remainingGuess = guess.split('').filter((_, i) => result[i] !== 'correct');

    let numMisplaced = 0;
    const used = new Set();
    for (let letter of remainingGuess) {
      const index = remainingAnswer.findIndex((l, idx) => l === letter && !used.has(idx));
      if (index !== -1) {
        numMisplaced++;
        used.add(index);
      }
    }

    return {
      summary: true,
      correct: numCorrect,
      misplaced: numMisplaced
    };
  }

  if (difficulty !== 'expert' && showMisplaced) {
    guessArray.forEach((letter, i) => {
      if (letter && answerArray.includes(letter)) {
        result[i] = 'misplaced';
        answerArray[answerArray.indexOf(letter)] = null;
      }
    });
  }

  if (difficulty === 'expert') {
    return result.map(r => (r === 'correct' ? 'correct' : 'none'));
  }

  if (difficulty === 'hard') {
    return result.map(r => (r === 'correct' ? 'misplaced' : r));
  }

  return result;
}