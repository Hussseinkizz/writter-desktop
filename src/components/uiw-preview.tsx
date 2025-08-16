import MarkdownPreview from '@uiw/react-markdown-preview';
import { ScrollArea } from './ui/scroll-area';

type UIWPreviewProps = {
  markdown: string;
};

/**
 * Preview component using @uiw/react-markdown-preview
 * Alternative to the existing preview component for testing
 */
export const UIWPreview = (props: UIWPreviewProps) => {
  return (
    <div className="h-[90vh] w-full overflow-y-auto bg-background">
      <MarkdownPreview
        source={props.markdown}
        style={{
          padding: 24,
          backgroundColor: 'transparent',
          color: '#e5e7eb',
        }}
        data-color-mode="dark"
        wrapperElement={{
          'data-color-mode': 'dark',
        }}
        components={{
          ul: ({ children, ...props }) => (
            <ul
              {...props}
              style={{
                listStyleType: 'disc',
                paddingLeft: '1.5rem',
                marginBottom: '1rem',
              }}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              {...props}
              style={{
                listStyleType: 'decimal',
                paddingLeft: '1.5rem',
                marginBottom: '1rem',
              }}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li
              {...props}
              style={{ marginBottom: '0.25rem', display: 'list-item' }}>
              {children}
            </li>
          ),
          table: ({ children, ...props }) => (
            <div className="w-full mb-4 overflow-x-auto overflow-y-auto max-h-[600px] rounded-md --border --border-gray-700 --bg-gray-900">
              <table
                {...props}
                style={{
                  width: '100%',
                  minWidth: 'max-content',
                  borderCollapse: 'collapse',
                  backgroundColor: '#111827',
                  display: 'table',
                }}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead {...props} className="bg-gray-800 w-full">
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody {...props} className="w-full">
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr
              {...props}
              className="border-b border-gray-700 hover:bg-gray-800/50 w-full">
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th
              {...props}
              className="px-4 py-3 text-left font-semibold text-white border-r border-gray-600 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              {...props}
              className="px-4 py-3 text-gray-200 border-r border-gray-700 last:border-r-0">
              {children}
            </td>
          ),
        }}
      />
    </div>
  );
};
