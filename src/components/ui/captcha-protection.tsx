
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface CaptchaProtectionProps {
  onVerify: (isVerified: boolean) => void;
  className?: string;
}

export function CaptchaProtection({ onVerify, className = "" }: CaptchaProtectionProps) {
  const [challenge, setChallenge] = useState({ question: '', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateChallenge = () => {
  const { t } = useTranslation('forms');
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer: number;
    let question: string;
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        answer = Math.max(num1, num2) - Math.min(num1, num2);
        question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
        break;
      case '×':
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
    }
    
    setChallenge({ question, answer });
    setUserAnswer('');
    setIsVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  useEffect(() => {
    const isCorrect = parseInt(userAnswer) === challenge.answer && userAnswer !== '';
    setIsVerified(isCorrect);
    onVerify(isCorrect);
  }, [userAnswer, challenge.answer, onVerify]);

  return (
    <div className={`bg-muted/30 border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Security Verification *
          </label>
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono bg-background border border-border rounded px-3 py-2 min-w-[80px] text-center">
              {challenge.question} = ?
            </span>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Answer"
              className="w-20 px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateChallenge}
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center">
          {isVerified ? (
            <div className="text-green-600 text-sm font-medium">✓ Verified</div>
          ) : (
            <div className="text-muted-foreground text-sm">Not verified</div>
          )}
        </div>
      </div>
    </div>
  );
}
