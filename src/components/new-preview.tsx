import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { motion, AnimatePresence } from 'framer-motion';

type PreviewProps = {
  markdown: string;
};

/**
 * Preview component that renders markdown content with proper styling
 * Uses Tailwind's prose classes for better typography and formatting
 * Includes subtle entrance animation with framer-motion
 */
export const Preview = (props: PreviewProps) => {
  return (
    <motion.div
      className="h-[90vh] w-full overflow-y-auto bg-background p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}>
      <div
        className="prose prose-invert prose-slate max-w-none 
                      prose-headings:text-white prose-p:text-gray-200 
                      prose-a:text-violet-500 prose-strong:text-white
                      prose-code:text-pink-400 prose-code:bg-gray-800 
                      prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                      prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
                      prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-300
                      prose-th:text-white prose-td:text-gray-200
                      prose-hr:border-gray-600">
        <AnimatePresence mode="wait">
          <motion.div
            key={props.markdown.substring(0, 50)} // Key based on content start for re-animation
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}>
            <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
              {props.markdown}
            </ReactMarkdown>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
