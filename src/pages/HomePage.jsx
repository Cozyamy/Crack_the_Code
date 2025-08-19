import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useTheme } from '../components/ThemeProvider';
import { useGame } from '../components/GameContext';
import { Moon, Sun, Trophy, Target } from 'lucide-react';
import { gameModes, difficulties, GameMode, Difficulty } from '../components/constants';

export default function HomePage() {
    const [selectedMode, setSelectedMode] = useState(GameMode.NUMBER);
    const [selectedDifficulty, setSelectedDifficulty] = useState(Difficulty.EASY);
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { startGame, gameStats } = useGame();

    const handleStartGame = () => {
        startGame(selectedMode, selectedDifficulty);
        navigate(selectedMode === 'number' ? '/number' : '/word');
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                    <div className="text-center flex-1">
                        <h1 className="sm:text-4xl text-2xl font-bold mb-2 bg-clip-text">
                            🧩 Crack the Code
                        </h1>
                    </div>
                    <Button variant="outline" size="sm" onClick={toggleTheme} className="ml-4">
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                </div>
                <p className="text-muted-foreground text-center mb-8 text-sm sm:text-base">
                    Challenge your mind with number and word puzzles
                </p>

                {/* Stats */}
                {gameStats.gamesPlayed > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-6">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-primary">{gameStats.gamesPlayed}</div>
                                <div className="text-sm text-muted-foreground">Games Played</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{gameStats.gamesWon}</div>
                                <div className="text-sm text-muted-foreground">Games Won</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{gameStats.currentStreak}</div>
                                <div className="text-sm text-muted-foreground">Current Streak</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{gameStats.maxStreak}</div>
                                <div className="text-sm text-muted-foreground">Best Streak</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Selection Panels */}
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Game Modes */}
                    <div className="space-y-6">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2">
                            <Trophy className="w-6 h-6" />
                            Choose Game Mode
                        </h2>
                        <div className="space-y-4">
                            {gameModes.map((mode) => {
                                const Icon = mode.icon;
                                return (
                                    <Card
                                        key={mode.id}
                                        onClick={() => setSelectedMode(mode.id)}
                                        className={`cursor-pointer transition-all hover:shadow-lg ${selectedMode === mode.id
                                            ? 'ring-2 ring-primary border-primary'
                                            : 'hover:border-primary/50'
                                            }`}
                                    >
                                        <CardContent className="p-2 sm:p-4">
                                            <div className="flex items-center space-x-4">
                                                <div
                                                    className={`w-8 sm:w-12 h-8 sm:h-12 rounded-lg flex items-center justify-center ${selectedMode === mode.id
                                                        ? 'bg-primary text-white'
                                                        : 'bg-muted text-black'
                                                        }`}
                                                >
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{mode.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{mode.example}</p>
                                                </div>
                                                {selectedMode === mode.id && <Badge>Selected</Badge>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Difficulty Levels */}
                    <div className="space-y-6">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-6 h-6" />
                            Choose Difficulty
                        </h2>
                        <div className="space-y-4">
                            {difficulties.map((difficulty) => {
                                const Icon = difficulty.icon;
                                return (
                                    <Card
                                        key={difficulty.id}
                                        onClick={() => setSelectedDifficulty(difficulty.id)}
                                        className={`cursor-pointer transition-all hover:shadow-lg ${selectedDifficulty === difficulty.id
                                            ? 'ring-2 ring-primary border-primary'
                                            : 'hover:border-primary/50'
                                            }`}
                                    >
                                        <CardContent className="p-2 sm:p-4">
                                            <div className="flex items-center space-x-4">
                                                <div
                                                    className={`w-8 sm:w-12 h-8 sm:h-12 rounded-lg flex items-center justify-center ${selectedDifficulty === difficulty.id
                                                        ? 'bg-primary text-white'
                                                        : 'bg-muted text-black'
                                                        }`}
                                                >
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold">{difficulty.title}</h3>
                                                        <Badge variant="outline" className={difficulty.color}>
                                                            {difficulty.attempts} attempts
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{difficulty.description}</p>
                                                </div>
                                                {selectedDifficulty === difficulty.id && <Badge>Selected</Badge>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button size="lg" onClick={handleStartGame}>
                        Start {selectedMode === 'number' ? 'Number' : 'Word'} Game
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/create')}>
                        Create Custom Game
                    </Button>
                </div>

                {/* Instructions */}
                <Card className="mt-12 max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>How to Play</CardTitle>
                        <CardDescription>Learn the rules and feedback system</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">🔢 Number Mode</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Guess a 4-digit number (0000-9999)</li>
                                    <li>• Each digit can be used multiple times</li>
                                    <li>• Use feedback to narrow down the answer</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">📝 Word Mode</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Guess a 5-letter English word</li>
                                    <li>• Letters can repeat in the target word</li>
                                    <li>• Use feedback to narrow down the answer</li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="font-semibold mb-3">🎨 Feedback Colors</h4>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-green-500 rounded border" />
                                    <span>Correct position</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-yellow-500 rounded border" />
                                    <span>Wrong position</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-400 rounded border" />
                                    <span>Not present</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}