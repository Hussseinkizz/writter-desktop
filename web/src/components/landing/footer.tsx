'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiGithub, FiHeart, FiMail } from 'react-icons/fi';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleEmailClick = () => {
    window.open('mailto:hssnkizz@gmail.com', '_blank');
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/Hussseinkizz/writter-desktop', '_blank');
  };

  const handleAuthorClick = () => {
    window.open('https://github.com/Hussseinkizz', '_blank');
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8">
          <div className="flex justify-center items-center gap-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleGitHubClick}
              className="text-zinc-400 hover:text-white group">
              <FiGithub className="group-hover:rotate-12 transition-transform" />
              GitHub
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleEmailClick}
              className="text-zinc-400 hover:text-white group">
              <FiMail className="group-hover:scale-110 transition-transform" />
              Contact
            </Button>
          </div>

          <div className="space-y-4 flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="Writter Logo"
              width={40}
              height={40}
              className="rounded-lg mb-2"
            />
            <h3 className="text-2xl font-bold gradient-text">Writter</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              The minimalistic markdown editor for your notes and thoughts.
            </p>
          </div>

          <div className="border-t border-zinc-800 pt-8 space-y-4">
            <p className="text-sm text-zinc-500">
              <span className="inline-flex items-center gap-1">
                Made with <FiHeart className="text-red-500 w-4 h-4" /> by{' '}
                <button
                  type="button"
                  onClick={handleAuthorClick}
                  className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors">
                  Hussein Kizz
                </button>
              </span>
            </p>

            <p className="text-xs text-zinc-600">
              © {currentYear} Writter Desktop. Open source under MIT License.
            </p>

            <div className="flex justify-center gap-4 text-xs text-zinc-600">
              <button
                type="button"
                onClick={handleGitHubClick}
                className="hover:text-violet-400 transition-colors">
                Source Code
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() =>
                  window.open(
                    'https://github.com/Hussseinkizz/writter-desktop/releases',
                    '_blank'
                  )
                }
                className="hover:text-violet-400 transition-colors">
                Releases
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() =>
                  window.open(
                    'https://github.com/Hussseinkizz/writter-desktop/issues',
                    '_blank'
                  )
                }
                className="hover:text-violet-400 transition-colors">
                Issues
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
