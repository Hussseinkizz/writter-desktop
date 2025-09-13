'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  FiShield
} from 'react-icons/fi';

const features = [
  {
    icon: FiFolder,
    title: 'Project-Based Workflow',
    description: 'Open and work with entire folders as projects. Browse, create, rename, and delete files from the sidebar.',
    category: 'File Management'
  },
  {
    icon: FiEye,
    title: 'Live Preview',
    description: 'See your formatted text as you type in a side-by-side view with smart text highlighting.',
    category: 'Editor & Preview'
  },
  {
    icon: FiSave,
    title: 'Auto-Save & Manual Save',
    description: 'Never lose your work with automatic saving and Ctrl+S/Cmd+S support.',
    category: 'File Management'
  },
  {
    icon: FiClock,
    title: 'Word Count & Time Tracking',
    description: 'Always know how many words you\'ve written and keep track of your writing time.',
    category: 'Editor & Preview'
  },
  {
    icon: FiTable,
    title: 'Table Creator',
    description: 'Build tables easily with a visual tool - no need to memorize markdown syntax.',
    category: 'Markdown Utilities'
  },
  {
    icon: FiHash,
    title: 'Snippets Library',
    description: 'Save and reuse common text blocks you write often with quick formatting tips.',
    category: 'Markdown Utilities'
  },
  {
    icon: FiMusic,
    title: 'Background Music Player',
    description: 'Built-in music player to set the mood while writing and stay focused.',
    category: 'Quality of Life'
  },
  {
    icon: FiCheckSquare,
    title: 'Simple Todo Manager',
    description: 'Quick task management without leaving the editor. Stay organized while you write.',
    category: 'Quality of Life'
  },
  {
    icon: FiZap,
    title: 'Lightning Fast',
    description: 'Optimized for speed and performance. Start writing instantly without delays.',
    category: 'Performance'
  },
  {
    icon: FiShield,
    title: 'Fully Offline',
    description: 'Your data stays on your device. No internet connection required. Complete privacy.',
    category: 'Privacy & Security'
  },
  {
    icon: FiEdit3,
    title: 'Smart Text Highlighting',
    description: 'Different parts of your markdown are highlighted for easy reading and writing.',
    category: 'Editor & Preview'
  },
  {
    icon: FiSettings,
    title: 'Customizable Settings',
    description: 'Adjust font size, themes, editor behavior, and appearance to match your preferences.',
    category: 'Customization'
  }
];

const categories = Array.from(new Set(features.map(f => f.category)));

export function FeaturesSection() {
  return (
    <section className="py-20 px-6 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Everything You Need to Write
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Writter is designed for technical users who want full control over their markdown workflow.
            Unlike drag-and-drop editors, Writter focuses on local-first simplicity and speed.
          </p>
        </motion.div>

        {categories.map((category, categoryIndex) => (
          <div key={category} className="mb-16">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="text-2xl font-semibold text-violet-400 mb-8 border-l-4 border-violet-600 pl-4"
            >
              {category}
            </motion.h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features
                .filter(feature => feature.category === category)
                .map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: (categoryIndex * 0.1) + (index * 0.1) 
                      }}
                    >
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
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-violet-950/50 to-violet-900/50 rounded-2xl border border-violet-800/30"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Writing?
          </h3>
          <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
            Join writers who have chosen simplicity, speed, and local-first control over their notes and thoughts.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="#download" 
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
            >
              Get Started Now
              <FiZap className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}