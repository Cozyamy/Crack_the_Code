import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useGame } from '../components/GameContext';
import { GameResultModal } from '../components/GameResultModal';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function NumberGamePage() {
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
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }
    }, []);

    const handleGuess = () => {
        if (guess.length !== 4 || !/^\d{4}$/.test(guess)) return;

        const result = checkNumberGuess(guess, answer, difficulty, showMisplaced);
        const newGuesses = [...guesses, { guess, result }];
        setGuess('');
        setCurrentGame(prev => ({
            ...prev,
            attempts: [...prev.attempts, { guess, result }],
        }));

        if (guess === answer) {
            endGame(true);
        } else if (newGuesses.length >= currentGame.maxAttempts) {
            endGame(false);
        }
    };

    if (!currentGame || currentGame.mode !== 'number') {
        return null;
    }

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
                            🔢
                        </div>
                        <span>Number Mode</span>
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
            <Card>
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
                            {currentGame.attempts.length} / {currentGame.maxAttempts} Attempts
                        </div>
                    </div>
                    <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded overflow-hidden">
                        <div
                            className="h-3 bg-blue-600"
                            style={{
                                width: currentGame.maxAttempts === Infinity
                                    ? '100%'
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
                                maxLength="4"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value.replace(/\D/g, ''))}
                                className="flex-1 p-1.5 text-sm sm:p-2 sm:text-base rounded border bg-background text-foreground"
                                placeholder="Enter 4-digit number"
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
                                    {entry.result.correct} digit{entry.result.correct !== 1 ? 's' : ''} in correct position
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
                                <span>Correct digit & position</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-yellow-500 rounded-full border" />
                                <span>Correct digit, wrong position</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-400 rounded-full border" />
                                <span>Digit not present</span>
                            </div>
                        </div>
                    </div>

                    {/* Medium */}
                    <div>
                        <strong>Medium (7 guesses):</strong>
                        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 mt-1">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-500 rounded-full border" />
                                <span>Correct digit & position</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-yellow-500 rounded-full border" />
                                <span>Correct digit, wrong position</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-400 rounded-full border" />
                                <span>Digit not present</span>
                            </div>
                        </div>
                    </div>

                    {/* Hard */}
                    <div>
                        <strong>Hard (5 guesses):</strong>
                        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 mt-1">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-yellow-500 rounded-full border" />
                                <span>Correct digit (position not shown)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-400 rounded-full border" />
                                <span>Digit not present</span>
                            </div>
                        </div>
                    </div>

                    {/* Expert */}
                    <div>
                        <strong>Expert (5 guesses):</strong>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-1">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-500 rounded-full border" />
                                <span>Correct digit only</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                No feedback is given for wrong or misplaced digits.
                            </div>
                        </div>
                    </div>

                    {/* Insane */}
                    <div>
                        <strong>Insane (∞ guesses):</strong>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Summary feedback only:
                            <ul className="list-disc list-inside mt-1">
                                <li><strong>Correct:</strong> Number of digits in the correct position</li>
                                <li><strong>Misplaced:</strong> (Optional) Number of correct digits in the wrong position</li>
                            </ul>
                            <p className="mt-1">Use the checkbox to toggle misplaced feedback.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <GameResultModal
                isOpen={isGameOver}
                onClose={() => { /* empty to prevent modal closing */ }}
                onPlayAgain={() => {
                    setGuess('');
                    setCurrentGame(prev => ({ ...prev, attempts: [] }));
                }}
                onShare={() => {
                    if (!currentGame) return;

                    const { attempts, isWon, maxAttempts, difficulty } = currentGame;

                    const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
                    const statusLine = isWon
                        ? `✅ Guessed in ${attempts.length}/${maxAttempts} attempts!`
                        : `❌ Failed after ${maxAttempts} attempts.`;

                    const resultLines = attempts.map(({ result }) => {
                        if (result.summary) {
                            // For 'insane' mode
                            const { correct, misplaced } = result;
                            return `✔️ ${correct} correct${typeof misplaced === 'number' ? `, 🔀 ${misplaced} misplaced` : ''}`;
                        }

                        return result.map(color => {
                            switch (color) {
                                case 'correct':
                                    return '🟩';
                                case 'misplaced':
                                    return '🟨';
                                case 'none':
                                case 'absent':
                                default:
                                    return '⬜';
                            }
                        }).join('');
                    });

                    const shareText = [
                        '🔢 Number Mode - ' + difficultyLabel,
                        statusLine,
                        '',
                        ...resultLines,
                        '',
                        'Play: https://crack-the-code-nine.vercel.app'
                    ].join('\n');

                    // Try Web Share API first
                    if (navigator.share) {
                        navigator.share({
                            title: 'Number Game Result',
                            text: shareText,
                            url: 'https://crack-the-code-nine.vercel.app',
                        }).catch((err) => {
                            console.error('Share failed:', err);
                        });
                    } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(shareText)
                            .then(() => {
                                alert('Result copied to clipboard!');
                            })
                            .catch(() => {
                                alert('Failed to copy result.');
                            });
                    }
                }}
            />
        </div>
    );
}

// Feedback checker function
function checkNumberGuess(guess, answer, difficulty, showMisplaced) {
    const result = Array(4).fill('absent');
    const answerArray = answer.split('');
    const guessArray = guess.split('');

    // First pass: correct digits
    guessArray.forEach((digit, i) => {
        if (digit === answerArray[i]) {
            result[i] = 'correct';
            answerArray[i] = null;
            guessArray[i] = null;
        }
    });

    if (difficulty === 'insane') {
        const numCorrect = result.filter(r => r === 'correct').length;

        // Count misplaced (wrong position but present elsewhere)
        const remainingAnswer = answer.split('').filter((_, i) => result[i] !== 'correct');
        const remainingGuess = guess.split('').filter((_, i) => result[i] !== 'correct');

        let numMisplaced = 0;
        const used = new Set();
        for (let digit of remainingGuess) {
            const index = remainingAnswer.findIndex((d, idx) => d === digit && !used.has(idx));
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
        guessArray.forEach((digit, i) => {
            if (digit && answerArray.includes(digit)) {
                result[i] = 'misplaced';
                answerArray[answerArray.indexOf(digit)] = null;
            }
        });
    }

    if (difficulty === 'expert') {
        return result.map(r => (r === 'correct' ? 'correct' : 'none'));
    }

    // Hard mode — no position info
    if (difficulty === 'hard') {
        return result.map(r => (r === 'correct' ? 'misplaced' : r));
    }

    return result;
}