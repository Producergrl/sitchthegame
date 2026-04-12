import { useState } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { safeGetItem, safeSetItem } from '@/lib/safeStorage';

const STORAGE_KEY = 'sitch_unlocked';
const VALID_CODE = 'SITCH2026';

export function isUnlocked(): boolean {
  return safeGetItem(STORAGE_KEY) === 'true';
}

export default function UnlockGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === VALID_CODE) {
      safeSetItem(STORAGE_KEY, 'true');
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)' }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl"
      >
        <Shield className="mx-auto mb-4 h-10 w-10 text-[#1E3A5F]" />
        <h1 className="text-xl font-bold text-[#1E3A5F]">Welcome to Sitch</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please enter your unlock code to play
        </p>

        <Input
          className="mt-6 text-center text-lg tracking-widest"
          placeholder="Enter code"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(false); }}
          autoFocus
        />

        {error && (
          <p className="mt-3 text-sm text-red-600">
            That code doesn't look right. Please check your Gumroad receipt and try again.
          </p>
        )}

        <Button
          type="submit"
          className="mt-5 w-full py-6 text-base font-bold uppercase tracking-wide"
          style={{ background: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)', color: '#FEF3D0' }}
        >
          Unlock
        </Button>
      </form>
    </div>
  );
}
