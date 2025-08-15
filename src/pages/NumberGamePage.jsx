// src/pages/NumberGamePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useGame } from '../components/GameContext';
import { GameResultModal } from '../components/GameResultModal';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function NumberGamePage() {
    const navigate = useNavigate();
    const [guess, setGuess] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const { currentGame, endGame, setCurrentGame, restartGame } = useGame();

    if (!currentGame || currentGame.mode !== 'number') {
        navigate('/');
        return null;
    }

    const { difficulty, answer } = currentGame;

    const handleGuess = () => {
        if (guess.length !== 4 || !/^\d{4}$/.test(guess)) return;

        const result = checkNumberGuess(guess, answer);
        const newGuesses = [...guesses, { guess, result }];
        setGuesses(newGuesses);
        setGuess('');
        setCurrentGame(prev => ({
            ...prev,
            attempts: [...prev.attempts, { guess, result }],
        }));

        if (guess === answer) {
            setIsGameOver(true);
            endGame(true);
        } else if (newGuesses.length >= currentGame.maxAttempts) {
            setIsGameOver(true);
            endGame(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <div className="flex justify-between items-center mb-6">
                {/* Left: Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1 text-gray-400 hover:text-blue-800 font-semibold border rounded-md border-gray-200 dark:border-gray-700 p-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </button>

                {/* Center: Mode info and difficulty */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-xl">
                        {/* You can replace this with your number mode icon */}
                        <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center font-mono text-xl">
                            🔢
                        </div>
                        <span className="text-xl">Number Mode</span>
                    </div>
                    <div className="mt-1 text-xs text-green-600 dark:text-green-400 border rounded-md border-gray-200 dark:border-gray-700 px-2 py-0.5">
                        <span className="uppercase font-mono pr-2">
                            {difficulty} -
                        </span>
                        <span className="font-mono">
                            {currentGame.attempts.length} / {currentGame.maxAttempts} attempts
                        </span>
                    </div>
                </div>

                {/* Right: New Game button */}
                <button
                    onClick={() => {
                        restartGame();
                        setIsGameOver(false);
                        setGuesses([]);
                        setGuess('');
                        // Optionally restart game logic here if available
                    }}
                    className="flex items-center gap-1 text-gray-400 hover:text-blue-800 font-semibold border rounded-md border-gray-200 dark:border-gray-700 p-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    New Game
                </button>
            </div>
            <Card>
                <CardContent className="space-y-4">
                    {/* <div className="text-muted-foreground">
                        Attempts left: <strong>{currentGame.maxAttempts - guesses.length}</strong>
                    </div> */}
                    <div className="mb-2 border rounded-md border-gray-200 dark:border-gray-700 p-4">
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
                                style={{ width: `${(currentGame.attempts.length / currentGame.maxAttempts) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Guess history */}
                    <div className="space-y-2">
                        {guesses.map((entry, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <div className="font-mono text-lg">{entry.guess}</div>
                                <div className="flex gap-1">
                                    {entry.result.map((color, j) => (
                                        <span
                                            key={j}
                                            className={`w-4 h-4 rounded-full border ${color === 'correct'
                                                ? 'bg-green-500'
                                                : color === 'misplaced'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-gray-400'
                                                }`}
                                        ></span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    {!isGameOver && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault(); // prevent page reload
                                handleGuess();
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                maxLength="4"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value.replace(/\D/g, ''))}
                                className="flex-1 p-2 rounded border bg-background text-foreground"
                                placeholder="Enter 4-digit number"
                            />
                            <Button type="submit">Guess</Button>
                        </form>
                    )}
                </CardContent>
            </Card>
            <GameResultModal
                isOpen={isGameOver}
                onClose={() => { /* do nothing or leave empty to prevent modal closing */ }}
                onPlayAgain={() => {
                    setIsGameOver(false);
                    setGuess('');
                    setGuesses([]);
                }}
                onShare={() => {
                    // Your share logic here
                    alert('Share functionality not implemented yet.');
                }}
            />
        </div>
    );
}

// Feedback checker function
function checkNumberGuess(guess, answer) {
    const result = Array(4).fill('absent');
    const answerArray = answer.split('');
    const guessArray = guess.split('');

    // First pass: correct digits
    guessArray.forEach((digit, i) => {
        if (digit === answerArray[i]) {
            result[i] = 'correct';
            answerArray[i] = null; // prevent re-use
            guessArray[i] = null;
        }
    });

    // Second pass: misplaced digits
    guessArray.forEach((digit, i) => {
        if (digit && answerArray.includes(digit)) {
            result[i] = 'misplaced';
            answerArray[answerArray.indexOf(digit)] = null;
        }
    });

    return result;
}