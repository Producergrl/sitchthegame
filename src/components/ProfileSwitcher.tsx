import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  loadProfiles, addProfile, deleteProfile, renameProfile,
  getActiveProfileId, setActiveProfileId,
  PROFILE_EMOJIS, MAX_PROFILES, DEFAULT_PROFILE_ID,
  type PlayerProfile,
} from '@/lib/profiles';

interface Props {
  /** Called after the active profile changes so parents can reload progress. */
  onChange?: () => void;
}

const ProfileSwitcher = ({ onChange }: Props) => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>(loadProfiles);
  const [activeId, setActiveId] = useState<string>(getActiveProfileId);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState(PROFILE_EMOJIS[1]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const refresh = () => {
    setProfiles(loadProfiles());
    setActiveId(getActiveProfileId());
    onChange?.();
  };

  const handleSelect = (id: string) => {
    setActiveProfileId(id);
    refresh();
  };

  const handleAdd = () => {
    if (profiles.length >= MAX_PROFILES) return;
    const created = addProfile(newName, newEmoji);
    setActiveProfileId(created.id);
    setNewName('');
    setAdding(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteProfile(id);
    refresh();
  };

  const handleRename = (id: string) => {
    renameProfile(id, editName);
    setEditingId(null);
    refresh();
  };

  return (
    <div className="rounded-2xl border-2 border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-black text-card-foreground">👨‍👩‍👧 Who is playing?</p>
        <span className="text-xs text-muted-foreground">{profiles.length} / {MAX_PROFILES}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Each player keeps their own XP, badges, and stickers. Progress stays on this device only.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {profiles.map(p => {
          const isActive = p.id === activeId;
          return (
            <motion.div
              key={p.id}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 rounded-xl border-2 p-2 transition-all ${
                isActive ? 'border-primary bg-primary/10' : 'border-border bg-background'
              }`}
            >
              <button
                type="button"
                onClick={() => handleSelect(p.id)}
                aria-label={`Play as ${p.name}`}
                aria-pressed={isActive}
                className="flex min-h-[44px] flex-1 items-center gap-2 rounded-lg px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="text-2xl">{p.emoji}</span>
                {editingId === p.id ? (
                  <input
                    value={editName}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                    onChange={e => setEditName(e.target.value.slice(0, 20))}
                    onKeyDown={e => { if (e.key === 'Enter') handleRename(p.id); }}
                    onBlur={() => handleRename(p.id)}
                    aria-label="Player name"
                    className="w-full rounded border border-border bg-background px-2 py-1 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <span className="truncate text-sm font-bold text-card-foreground">{p.name}</span>
                )}
                {isActive && <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />}
              </button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Rename ${p.name}`}
                className="h-11 w-11 text-xs text-muted-foreground"
                onClick={() => { setEditingId(p.id); setEditName(p.name); }}
              >
                ✏️
              </Button>
              {p.id !== DEFAULT_PROFILE_ID && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${p.name}`}
                  className="h-11 w-11 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>

      {adding ? (
        <div className="space-y-2 rounded-xl border-2 border-primary/40 bg-primary/5 p-3">
          <input
            value={newName}
            autoFocus
            onChange={e => setNewName(e.target.value.slice(0, 20))}
            placeholder="Name (for example: Ava)"
            aria-label="New player name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex flex-wrap gap-1.5">
            {PROFILE_EMOJIS.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => setNewEmoji(e)}
                aria-label={`Choose avatar ${e}`}
                aria-pressed={newEmoji === e}
                className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 text-xl ${
                  newEmoji === e ? 'border-primary bg-primary/10' : 'border-border bg-background'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 font-bold" onClick={handleAdd}>Add player</Button>
            <Button variant="outline" className="font-bold" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        profiles.length < MAX_PROFILES && (
          <Button variant="outline" className="w-full gap-2 font-bold" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> Add another player
          </Button>
        )
      )}
    </div>
  );
};

export default ProfileSwitcher;
