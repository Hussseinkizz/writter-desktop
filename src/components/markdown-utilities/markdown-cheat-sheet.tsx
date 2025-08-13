import { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { HiQuestionMarkCircle, HiClipboard } from 'react-icons/hi';
import { toast } from 'sonner';

/**
 * Markdown cheat sheet data structure
 */
const createCheatSheetData = () => {
  return [
    {
      category: 'Headers',
      items: [
        { syntax: '# Header 1', description: 'Largest header' },
        { syntax: '## Header 2', description: 'Second level header' },
        { syntax: '### Header 3', description: 'Third level header' },
        { syntax: '#### Header 4', description: 'Fourth level header' },
        { syntax: '##### Header 5', description: 'Fifth level header' },
        { syntax: '###### Header 6', description: 'Smallest header' },
      ],
    },
    {
      category: 'Text Formatting',
      items: [
        { syntax: '**bold text**', description: 'Bold text' },
        { syntax: '*italic text*', description: 'Italic text' },
        { syntax: '***bold and italic***', description: 'Bold and italic' },
        { syntax: '~~strikethrough~~', description: 'Strikethrough text' },
        { syntax: '`inline code`', description: 'Inline code' },
        { syntax: '> Quote', description: 'Blockquote' },
      ],
    },
    {
      category: 'Lists',
      items: [
        { syntax: '- Item 1\n- Item 2', description: 'Unordered list' },
        { syntax: '1. Item 1\n2. Item 2', description: 'Ordered list' },
        { syntax: '- [x] Completed\n- [ ] Todo', description: 'Task list' },
        { syntax: '- Item 1\n  - Nested item', description: 'Nested list' },
      ],
    },
    {
      category: 'Links & Images',
      items: [
        { syntax: '[Link text](URL)', description: 'Link' },
        { syntax: '[Link text](URL "Title")', description: 'Link with title' },
        { syntax: '![Alt text](image.jpg)', description: 'Image' },
        { syntax: '![Alt text](image.jpg "Title")', description: 'Image with title' },
        { syntax: '<https://example.com>', description: 'Automatic link' },
      ],
    },
    {
      category: 'Code',
      items: [
        { syntax: '```javascript\ncode here\n```', description: 'Code block with language' },
        { syntax: '```\ncode here\n```', description: 'Code block' },
        { syntax: '    indented code', description: 'Indented code block' },
      ],
    },
    {
      category: 'Tables',
      items: [
        { 
          syntax: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |', 
          description: 'Basic table' 
        },
        { 
          syntax: '| Left | Center | Right |\n|:-----|:------:|------:|\n| L    | C      | R     |', 
          description: 'Aligned table' 
        },
      ],
    },
    {
      category: 'Other',
      items: [
        { syntax: '---', description: 'Horizontal rule' },
        { syntax: '\\*escaped\\*', description: 'Escaped characters' },
        { syntax: '[^1]: Footnote text', description: 'Footnote definition' },
        { syntax: 'Text with footnote[^1]', description: 'Footnote reference' },
      ],
    },
  ];
};

/**
 * Copy text to clipboard utility function
 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Individual cheat sheet item component
 */
const CheatSheetItem = ({ syntax, description }: { syntax: string; description: string }) => {
  const handleCopy = async () => {
    const success = await copyToClipboard(syntax);
    if (success) {
      toast.success('Copied to clipboard!');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
      <div className="flex-1">
        <code className="text-sm font-mono text-green-400 bg-neutral-900 px-2 py-1 rounded">
          {syntax}
        </code>
        <p className="text-xs text-neutral-400 mt-1">{description}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="ml-2 text-neutral-400 hover:text-neutral-200"
        title="Copy to clipboard"
      >
        <HiClipboard className="h-4 w-4" />
      </Button>
    </div>
  );
};

/**
 * Markdown cheat sheet dialog component
 */
export const MarkdownCheatSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cheatSheetData = createCheatSheetData();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-neutral-300 hover:bg-zinc-800 transition"
          title="Markdown Cheat Sheet"
          aria-label="Open markdown cheat sheet"
        >
          <HiQuestionMarkCircle className="text-xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-xl font-semibold">
            Markdown Cheat Sheet
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {cheatSheetData.map((section) => (
              <div key={section.category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-neutral-200">
                    {section.category}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {section.items.length} items
                  </Badge>
                </div>
                <div className="space-y-2">
                  {section.items.map((item, index) => (
                    <CheatSheetItem
                      key={index}
                      syntax={item.syntax}
                      description={item.description}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};