import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

const FN_URL = 'https://gmzptuwtnfevrfebmzti.supabase.co/functions/v1/gumroad-sync';

const SyncToGumroadButton = () => {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');

  const run = async () => {
    setStatus('syncing');
    try {
      const res = await fetch(FN_URL, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) {
        setStatus('done');
        toast.success('Gumroad product updated');
      } else {
        setStatus('error');
        toast.error('Gumroad sync failed', { description: data?.details ? String(data.details).slice(0, 200) : `HTTP ${res.status}` });
      }
    } catch (err) {
      setStatus('error');
      toast.error('Gumroad sync failed', { description: (err as Error).message });
    } finally {
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <Button onClick={run} disabled={status === 'syncing'} variant="outline" className="gap-2">
      {status === 'done' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <RefreshCw className={`h-4 w-4 ${status === 'syncing' ? 'animate-spin' : ''}`} />}
      {status === 'syncing' ? 'Syncing…' : status === 'done' ? 'Synced to Gumroad' : 'Sync to Gumroad'}
    </Button>
  );
};

export default SyncToGumroadButton;
