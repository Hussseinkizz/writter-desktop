import { useState } from 'react';
import { openUrl } from '@tauri-apps/plugin-opener';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { HiInformationCircle, HiHeart, HiCode } from 'react-icons/hi';

/**
 * About dialog component - shows app information, version, and credits
 */
export const AboutDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-neutral-300 hover:bg-zinc-800 transition"
          title="About Writter"
          aria-label="Open about dialog">
          <HiInformationCircle className="text-xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-xl w-full justify-center items-center flex font-semibold pb-2 border-b border-neutral-800">
            About
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section with Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <h1
                className="text-3xl lg:text-4xl font-bold relative text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-600 to-violet-400"
                style={{
                  WebkitTextStroke: '0.8px rgba(167,139,250,0.5)',
                  filter: 'drop-shadow(0 0 2px rgba(167,139,250,0.25))',
                }}>
                ⌘ Writter
              </h1>
            </div>
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className="bg-violet-600/20 text-violet-300 border-violet-500/30">
                v0.0.8
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className="text-center space-y-3">
            <p className="text-neutral-300 text-lg leading-relaxed">
              The minimal editor for documenting, note taking and micro blogging
              using markdown.
            </p>
            <p className="text-neutral-400 text-sm">
              Writter is free and open source
            </p>
          </div>

          {/* Links and Credits */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                className="border-violet-600/50 text-violet-400 hover:bg-violet-600/10"
                onClick={() =>
                  openUrl('https://github.com/Hussseinkizz/writter-desktop')
                }>
                <HiCode className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-600/50 text-amber-400 hover:bg-amber-600/10"
                onClick={() => openUrl('https://buymeacoffee.com/husseinkizz')}>
                <HiHeart className="h-4 w-4 mr-2" />
                Support the Author
              </Button>
            </div>

            {/* Credits */}
            <div className="text-center space-y-2">
              <p className="text-xs text-neutral-500">
                Made with <span className="text-amber-500">🧡</span> by{' '}
                <a
                  href="https://github.com/Hussseinkizz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline underline-offset-2 font-medium">
                  Hussein Kizz
                </a>
              </p>
            </div>
          </div>

          {/* Inspirational Quote (like in welcome screen) */}
          <div className="relative text-center py-4">
            <p className="text-xs text-neutral-500 italic leading-relaxed">
              "if it doesn't come bursting out of you
              <br />
              in spite of everything,
              <br />
              don't do it."
            </p>
            <p className="text-xs text-neutral-600 mt-2">— Charles Bukowski</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
