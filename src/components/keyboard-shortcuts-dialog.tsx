import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Kbd } from './ui/kbd';

type ShortcutInfo = {
  keys: string;
  description: string;
  category: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function KeyboardShortcutsDialog({ open, onOpenChange }: Props) {
  const [shortcuts, setShortcuts] = useState<ShortcutInfo[]>([]);

  useEffect(() => {
    if (open && shortcuts.length === 0) {
      invoke<ShortcutInfo[]>('get_keyboard_shortcuts')
        .then(setShortcuts)
        .catch(() => {});
    }
  }, [open]);

  const grouped = shortcuts.reduce<Record<string, ShortcutInfo[]>>(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    },
    {}
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border-neutral-700 text-neutral-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-violet-400 text-base">
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-1 max-h-[60vh] overflow-y-auto pr-1">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((s) => (
                  <div
                    key={s.keys}
                    className="flex items-center justify-between gap-4">
                    <span className="text-sm text-neutral-300">
                      {s.description}
                    </span>
                    <Kbd className="shrink-0 text-[10px] px-2 py-0.5 h-auto">
                      {s.keys}
                    </Kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
