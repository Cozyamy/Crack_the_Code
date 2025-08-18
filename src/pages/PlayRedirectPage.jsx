import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../components/GameContext';
import { decodeGameParams } from '../utils/encryption';

export default function PlayRedirectPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { currentGame, startCustomGame } = useGame();

  useEffect(() => {
    const code = params.get('code');

    let mode, answer, maxAttempts;

    if (code) {
      const decoded = decodeGameParams(code);

      if (!decoded || !decoded.mode || !decoded.answer) {
        navigate('/?error=invalid-code');
        return;
      }

      mode = decoded.mode;
      answer = decoded.answer;
      maxAttempts = decoded.maxAttempts ?? 10;
    } else {
      // fallback to old query params
      mode = params.get('mode');
      answer = params.get('answer');
      maxAttempts = parseInt(params.get('maxAttempts'), 10);
    }

    if (!mode || !answer) {
      navigate('/?error=missing-params');
      return;
    }

    const isValidNumber = (value) => /^\d{4}$/.test(value);
    const isValidWord = (value) => /^[a-zA-Z]{5}$/.test(value);

    const isParamsSameAsCurrentGame =
      currentGame &&
      currentGame.mode === mode &&
      currentGame.answer === answer.toLowerCase() &&
      currentGame.maxAttempts === (isNaN(maxAttempts) ? 10 : maxAttempts);

    if (
      (mode === 'number' && isValidNumber(answer)) ||
      (mode === 'word' && isValidWord(answer))
    ) {
      if (!isParamsSameAsCurrentGame) {
        startCustomGame({
          mode,
          answer: answer.toLowerCase(),
          maxAttempts: isNaN(maxAttempts) ? 10 : maxAttempts,
        });
      }
    } else {
      navigate('/?error=invalid-custom-game');
    }
  }, [params, navigate, currentGame, startCustomGame]);

  useEffect(() => {
    if (currentGame) {
      navigate(currentGame.mode === 'number' ? '/number' : '/word');
    }
  }, [currentGame, navigate]);

  return <p className="text-center p-8">Setting up your custom game...</p>;
}