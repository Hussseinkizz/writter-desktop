import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

type PreviewProps = {
  markdown: string;
};

/**
 * Preview component that renders markdown content with proper styling
 * Uses Tailwind's prose classes for better typography and formatting
 */
export const Preview = (props: PreviewProps) => {
  return (
    <div className="h-[90vh] w-full overflow-y-auto bg-background p-6">
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
        <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
          {props.markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};
