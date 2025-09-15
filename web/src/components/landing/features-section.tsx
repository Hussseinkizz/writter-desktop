'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  FiFolder,
  FiEdit3,
  FiEye,
  FiSave,
  FiClock,
  FiHash,
  FiTable,
  FiMusic,
  FiCheckSquare,
  FiSettings,
  FiZap,
  FiShield,
} from 'react-icons/fi';
import { ImageZoom } from '../ui/kibo-ui/image-zoom';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: FiFolder,
    title: 'Project-Based Workflow',
    description:
      'Open and work with entire folders as projects. Browse, create, rename, and delete files from the sidebar.',
  },
  {
    icon: FiEye,
    title: 'Live Preview',
    description:
      'See your formatted text as you type in a side-by-side view with smart text highlighting.',
  },
  {
    icon: FiSave,
    title: 'Auto-Save & Manual Save',
    description:
      'Never lose your work with automatic saving and Ctrl+S/Cmd+S support.',
  },
  {
    icon: FiClock,
    title: 'Word Count & Time Tracking',
    description:
      "Always know how many words you've written and keep track of your writing time.",
  },
  {
    icon: FiTable,
    title: 'Table Creator',
    description:
      'Build tables easily with a visual tool - no need to memorize markdown syntax.',
  },
  {
    icon: FiHash,
    title: 'Snippets Library',
    description:
      'Save and reuse common text blocks you write often with quick formatting tips.',
  },
  {
    icon: FiMusic,
    title: 'Background Music Player',
    description:
      'Built-in music player to set the mood while writing and stay focused.',
  },
  {
    icon: FiCheckSquare,
    title: 'Simple Todo Manager',
    description:
      'Quick task management without leaving the editor. Stay organized while you write.',
  },
  {
    icon: FiZap,
    title: 'Lightning Fast',
    description:
      'Optimized for speed and performance. Start writing instantly without delays.',
  },
  {
    icon: FiShield,
    title: 'Fully Offline',
    description:
      'Your data stays on your device. No internet connection required. Complete privacy.',
  },
  {
    icon: FiEdit3,
    title: 'Smart Text Highlighting',
    description:
      'Different parts of your markdown are highlighted for easy reading and writing.',
  },
  {
    icon: FiSettings,
    title: 'Customizable Settings',
    description:
      'Adjust font size, themes, editor behavior, and appearance to match your preferences.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-6 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Everything You Need to Write
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Writter is designed for technical users who want full control over
            their markdown workflow while still remaining simple and intuitive.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20 flex justify-center">
          <ImageZoom
            backdropClassName={cn(
              '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
            )}>
            <Image
              alt="Writter App Preview"
              className="h-auto w-full max-w-5xl rounded-xl border border-zinc-700/50 shadow-2xl shadow-violet-950/20"
              height={800}
              src="/preview.png"
              unoptimized
              width={1200}
            />
          </ImageZoom>
        </motion.div>

        {/* Flat responsive grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card className="h-full hover:bg-zinc-800/50 transition-colors group">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-violet-600/20 group-hover:bg-violet-600/30 transition-colors">
                        <Icon className="w-6 h-6 text-violet-400" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-zinc-400 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
