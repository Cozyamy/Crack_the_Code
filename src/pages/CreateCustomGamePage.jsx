import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { gameModes, GameMode } from '../components/constants';
import { Badge } from '../components/ui/badge';
import { encodeGameParams } from '../utils/encryption';

export default function CreateCustomGamePage() {
  const [mode, setMode] = useState(GameMode.NUMBER);
  const [customAnswer, setCustomAnswer] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(10);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const validateAnswer = () => {
    if (mode === GameMode.NUMBER && !/^\d{4}$/.test(customAnswer)) {
      return 'Answer must be a 4-digit number';
    }
    if (mode === GameMode.WORD && !/^[a-zA-Z]{5}$/.test(customAnswer)) {
      return 'Answer must be a 5-letter word';
    }
    return '';
  };

  const handleCopyLink = async () => {
  const err = validateAnswer();
  if (err) {
    setError(err);
    return;
  }

  const baseUrl = window.location.origin;
  const encoded = encodeGameParams({
    mode,
    answer: customAnswer.toLowerCase(),
    maxAttempts,
  });

  const shareUrl = `${baseUrl}/play?code=${encoded}`;

  try {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setError('');
  } catch (err) {
    setError('Failed to copy link');
  }
};

  return (
    <div className="min-h-screen bg-muted/10 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode selection */}
            <div>
              <Label className="block mb-2">Game Mode</Label>
              <div className="flex gap-4">
                {gameModes.map(({ id, title }) => (
                  <Button
                    key={id}
                    variant={mode === id ? 'default' : 'outline'}
                    onClick={() => setMode(id)}
                  >
                    {title}
                    {mode === id && <Badge className="ml-2">Selected</Badge>}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom answer input */}
            <div>
              <Label className="block mb-2">
                {mode === GameMode.NUMBER ? '4-digit Number' : '5-letter Word'}
              </Label>
              <Input
                value={customAnswer}
                onChange={(e) => setCustomAnswer(e.target.value)}
                placeholder={mode === GameMode.NUMBER ? 'e.g. 1234' : 'e.g. apple'}
              />
            </div>

            {/* Max attempts */}
            <div>
              <Label className="block mb-2">Max Attempts</Label>
              <Input
                type="number"
                min={1}
                max={99}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
              />
            </div>

            {/* Feedback */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {copied && <p className="text-green-600 text-sm">Link copied to clipboard!</p>}

            {/* Copy Link Button */}
            <Button onClick={handleCopyLink} className="w-full mt-2">
              Copy Game Link
            </Button>

            {/* Back button */}
            <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>
              ← Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}