'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FiDownload, FiGithub } from 'react-icons/fi';
import {
  detectOS,
  getPrimaryDownload,
  formatFileSize,
  type DownloadAsset,
} from '@/lib/download-utils';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function HeroSection() {
  const [primaryDownload, setPrimaryDownload] = useState<DownloadAsset | null>(
    null
  );
  const [userOS, setUserOS] = useState<string>('');

  useEffect(() => {
    const os = detectOS();
    const download = getPrimaryDownload();
    setUserOS(os);
    setPrimaryDownload(download);
  }, []);

  const handleDownload = () => {
    if (primaryDownload) {
      window.open(primaryDownload.url, '_blank');
    }
  };

  const handleViewGitHub = () => {
    window.open('https://github.com/Hussseinkizz/writter-desktop', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-900">
      {/* Background Quote - Subtle Bukowski inspiration */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 0 }}>
        <span className="text-[8vw] lg:text-[5vw] font-bold italic opacity-5 text-violet-300 whitespace-pre-line text-center leading-tight drop-shadow-[0_0_18px_rgba(139,92,246,0.12)]">
          {`"if it doesn't come bursting out of you\nin spite of everything,\ndon't do it."`}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Writter Logo"
            width={80}
            height={80}
            className="rounded-2xl mb-6 drop-shadow-[0_0_18px_rgba(139,92,246,0.12)] hover:scale-105 transition-transform"
          />
          <h1
            className="text-5xl lg:text-7xl font-bold mb-8 relative gradient-text pulsing-glow"
            style={{
              WebkitTextStroke: '2px #a78bfa',
            }}>
            ⌘ Writter
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 mb-12">
          <h2 className="text-2xl lg:text-3xl text-zinc-300 font-light">
            The minimalistic markdown editor for your notes and thoughts
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Fully offline-first desktop editor that focuses on local-first
            simplicity, speed, and the power of pure thought to action. Free and
            open source.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="xl"
            onClick={handleDownload}
            className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/25 group w-full md:w-fit">
            <FiDownload className="group-hover:animate-bounce" />
            Download for {userOS}
            {primaryDownload && (
              <span className="text-xs opacity-75">
                ({formatFileSize(primaryDownload.size)})
              </span>
            )}
          </Button>

          <Button
            size="xl"
            variant="outline"
            onClick={handleViewGitHub}
            className="border-zinc-600 w-full md:w-fit text-zinc-300 hover:bg-zinc-800 group">
            <FiGithub className="group-hover:rotate-12 transition-transform" />
            View on GitHub
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-sm text-zinc-500">
          v0.0.9 Beta • Free & Open Source • Available for Windows, macOS &
          Linux
        </motion.div>
      </div>

      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-violet-950/20 animate-pulse" />
    </section>
  );
}
