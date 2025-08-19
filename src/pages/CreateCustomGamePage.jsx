import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { gameModes, GameMode } from '../components/constants';
import { Badge } from '../components/ui/badge';
import { encodeGameParams } from '../utils/encryption';
import { Switch } from '../components/ui/switch';
import { Tooltip } from '../components/ui/tooltip';


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

        if (maxAttempts !== Infinity && (isNaN(maxAttempts) || maxAttempts < 1)) {
        setError('Max attempts must be at least 1 or set to unlimited');
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
                        <h3 className="text-center text-xl font-bold text-gray-900 dark:text-white">Create Custom Game</h3>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Mode selection */}
                        <div>
                            <Label className="block mb-2">Game Mode</Label>
                            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                {gameModes.map(({ id, title }) => (
                                    <Button
                                        key={id}
                                        variant={mode === id ? 'default' : 'outline'}
                                        onClick={() => setMode(id)}
                                        className="w-full"
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
                                className="text-gray-800"
                            />
                        </div>

                        {/* Max Attempts */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>Max Attempts</Label>
                                <Tooltip content="Allow unlimited attempts">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">∞</span>
                                        <Switch
                                            checked={maxAttempts === Infinity}
                                            onCheckedChange={(checked) => setMaxAttempts(checked ? Infinity : 10)}
                                        />
                                    </div>
                                </Tooltip>
                            </div>
                            <Input
                                type="number"
                                min={1}
                                max={99}
                                disabled={maxAttempts === Infinity}
                                value={maxAttempts === Infinity ? '' : maxAttempts}
                                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                                className="text-gray-800 w-full"
                                placeholder="e.g. 10"
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