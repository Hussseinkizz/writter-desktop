'use client';

import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

const ISSUES_URL =
  'https://github.com/Hussseinkizz/writter-desktop/issues';

export function AnnouncementBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="relative z-50 w-full overflow-hidden border-b border-amber-500/20 bg-zinc-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-950/30 via-amber-900/20 to-amber-950/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent banner-shimmer"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-center gap-2.5 px-4 py-2.5 sm:flex-row sm:gap-5 sm:py-2">
        <p className="text-center text-sm text-zinc-300 sm:text-left">
          <span className="bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400 bg-clip-text font-semibold text-transparent">
            Writter v2
          </span>{' '}
          launches{' '}
          <span className="font-medium text-amber-300/95">
            August 30, 2026
          </span>
        </p>

        <a
          href={ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-md border border-amber-500/40 bg-zinc-900/70 px-3 py-1.5 text-sm font-medium text-amber-100/90 transition-all hover:border-amber-400/55 hover:bg-amber-500/12 hover:text-amber-50 active:scale-[0.98]">
          Feature request?
          <FiArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </motion.div>
  );
}
