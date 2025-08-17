import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useGame } from './GameContext';
import { Trophy, Target, Clock, RotateCcw, Share2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function GameResultModal({ isOpen, onClose, onPlayAgain, onShare }) {
  const { currentGame, gameStats, resetGame, restartGame } = useGame();
  const navigate = useNavigate();

  if (!currentGame || !isOpen) return null;

  const timeElapsed =
    currentGame.timeCompleted && currentGame.timeStarted
      ? Math.floor((currentGame.timeCompleted - currentGame.timeStarted) / 1000)
      : 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getPerformanceMessage = () => {
  if (!currentGame.isWon) return 'Better luck next time!';

  if (currentGame.difficulty === 'insane') {
    if (currentGame.attempts.length <= 5) return 'Unbelievable. 🧠';
    if (currentGame.attempts.length <= 10) return 'Mind-blowing! 🤯';
    return 'That was brutal. 🔥';
  }

  if (currentGame.maxAttempts === Infinity) {
    if (currentGame.attempts.length <= 5) return 'Incredible! 🧠';
    if (currentGame.attempts.length <= 10) return 'Great thinking! 💡';
    return 'You cracked it! 🧩';
  }

  const percentage = (currentGame.attempts.length / currentGame.maxAttempts) * 100;
  if (percentage <= 20) return 'Incredible! 🏆';
  if (percentage <= 40) return 'Excellent! 🌟';
  if (percentage <= 60) return 'Great job! 👏';
  if (percentage <= 80) return 'Well done! 👍';
  return 'Nice work! 😊';
};

  const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-100 bg-green-800 border-green-200';
    case 'medium':
      return 'text-yellow-100 bg-yellow-800 border-yellow-200';
    case 'hard':
      return 'text-red-100 bg-red-800 border-red-200';
    case 'expert':
      return 'text-purple-100 bg-purple-800 border-purple-200';
    case 'insane':
      return 'text-pink-100 bg-pink-800 border-pink-200';
    default:
      return 'text-gray-100 bg-gray-800 border-gray-200';
  }
};

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-lg relative"
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        >
          <div className="text-center mb-6">
            {currentGame.isWon ? (
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
                <Target className="w-8 h-8 text-red-600" />
              </div>
            )}

            <h2 className="text-2xl font-semibold mt-4">
              {currentGame.isWon ? '🎉 Congratulations!' : '😔 Game Over'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{getPerformanceMessage()}</p>
          </div>

          {/* Result Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">Target:</span>
              <Badge variant="outline" className="font-mono text-lg px-3">
                {currentGame.answer}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Attempts:</span>
              <Badge variant={currentGame.isWon ? 'default' : 'destructive'}>
                {currentGame.attempts.length} / {currentGame.maxAttempts === Infinity ? '∞' : currentGame.maxAttempts}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Difficulty:</span>
              <Badge className={getDifficultyColor(currentGame.difficulty)}>
                {currentGame.difficulty.toUpperCase()}
              </Badge>
            </div>

            {timeElapsed > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Time:</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-3 text-center">Your Stats</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{gameStats.gamesPlayed}</div>
                <div className="text-xs text-muted-foreground">Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {gameStats.gamesPlayed > 0
                    ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100)
                    : 0}
                  %
                </div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{gameStats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Current Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{gameStats.maxStreak}</div>
                <div className="text-xs text-muted-foreground">Best Streak</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button onClick={onShare} variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>

            <Button
              onClick={() => {
                restartGame();    // Clear current game state
                onPlayAgain();  // Reset the component state
              }}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>

          <Button
            onClick={() => {
              navigate('/'); // navigate first
              setTimeout(() => resetGame(), 0); // defer reset
            }}
            variant="ghost"
            className="w-full flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </>
  );
}