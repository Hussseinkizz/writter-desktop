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
import { Kbd } from '../ui/kbd';
import { 
  HiLightningBolt, 
  HiCode, 
  HiLink,
  HiPhotograph,
  HiViewList,
  HiHashtag,
  HiQuestionMarkCircle
} from 'react-icons/hi';
import { toast } from 'sonner';

/**
 * Formatting action interface
 */
interface FormattingAction {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  shortcut?: string[];
  category: string;
  action: (selectedText?: string) => string;
}

/**
 * Get current text selection in editor
 */
const getCurrentSelection = (): { text: string; start: number; end: number } | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  
  const range = selection.getRangeAt(0);
  return {
    text: range.toString(),
    start: range.startOffset,
    end: range.endOffset,
  };
};

/**
 * Insert text at cursor position or replace selection
 */
const insertTextAtCursor = (text: string, replaceSelection = true): boolean => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  
  if (replaceSelection) {
    range.deleteContents();
  }
  
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  
  // Move cursor to end of inserted text
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);
  
  return true;
};

/**
 * Create formatting actions
 */
const createFormattingActions = (): FormattingAction[] => {
  return [
    {
      id: 'bold',
      name: 'Bold',
      description: 'Make text bold',
      icon: HiQuestionMarkCircle, // Using placeholder icon
      shortcut: ['Ctrl', 'B'],
      category: 'Text Formatting',
      action: (selectedText = '') => {
        if (selectedText) {
          return `**${selectedText}**`;
        }
        return '**bold text**';
      },
    },
    {
      id: 'italic',
      name: 'Italic',
      description: 'Make text italic',
      icon: HiQuestionMarkCircle, // Using placeholder icon
      shortcut: ['Ctrl', 'I'],
      category: 'Text Formatting',
      action: (selectedText = '') => {
        if (selectedText) {
          return `*${selectedText}*`;
        }
        return '*italic text*';
      },
    },
    {
      id: 'code',
      name: 'Inline Code',
      description: 'Format as inline code',
      icon: HiCode,
      shortcut: ['Ctrl', '`'],
      category: 'Text Formatting',
      action: (selectedText = '') => {
        if (selectedText) {
          return `\`${selectedText}\``;
        }
        return '`code`';
      },
    },
    {
      id: 'strikethrough',
      name: 'Strikethrough',
      description: 'Strike through text',
      icon: HiQuestionMarkCircle,
      category: 'Text Formatting',
      action: (selectedText = '') => {
        if (selectedText) {
          return `~~${selectedText}~~`;
        }
        return '~~strikethrough~~';
      },
    },
    {
      id: 'h1',
      name: 'Heading 1',
      description: 'Create a level 1 heading',
      icon: HiHashtag,
      shortcut: ['Ctrl', '1'],
      category: 'Headings',
      action: (selectedText = '') => {
        if (selectedText) {
          return `# ${selectedText}`;
        }
        return '# Heading 1';
      },
    },
    {
      id: 'h2',
      name: 'Heading 2',
      description: 'Create a level 2 heading',
      icon: HiHashtag,
      shortcut: ['Ctrl', '2'],
      category: 'Headings',
      action: (selectedText = '') => {
        if (selectedText) {
          return `## ${selectedText}`;
        }
        return '## Heading 2';
      },
    },
    {
      id: 'h3',
      name: 'Heading 3',
      description: 'Create a level 3 heading',
      icon: HiHashtag,
      shortcut: ['Ctrl', '3'],
      category: 'Headings',
      action: (selectedText = '') => {
        if (selectedText) {
          return `### ${selectedText}`;
        }
        return '### Heading 3';
      },
    },
    {
      id: 'link',
      name: 'Link',
      description: 'Create a link',
      icon: HiLink,
      shortcut: ['Ctrl', 'K'],
      category: 'Links & Media',
      action: (selectedText = '') => {
        const url = prompt('Enter URL:');
        if (url) {
          if (selectedText) {
            return `[${selectedText}](${url})`;
          }
          return `[link text](${url})`;
        }
        return selectedText || '[link text](url)';
      },
    },
    {
      id: 'image',
      name: 'Image',
      description: 'Insert an image',
      icon: HiPhotograph,
      category: 'Links & Media',
      action: (selectedText = '') => {
        const url = prompt('Enter image URL:');
        const alt = prompt('Enter alt text:') || 'image';
        if (url) {
          return `![${alt}](${url})`;
        }
        return '![alt text](image-url)';
      },
    },
    {
      id: 'unordered-list',
      name: 'Bullet List',
      description: 'Create an unordered list',
      icon: HiViewList,
      category: 'Lists',
      action: (selectedText = '') => {
        if (selectedText) {
          const lines = selectedText.split('\n');
          return lines.map(line => `- ${line.trim()}`).join('\n');
        }
        return '- List item 1\n- List item 2\n- List item 3';
      },
    },
    {
      id: 'ordered-list',
      name: 'Numbered List',
      description: 'Create an ordered list',
      icon: HiViewList,
      category: 'Lists',
      action: (selectedText = '') => {
        if (selectedText) {
          const lines = selectedText.split('\n');
          return lines.map((line, index) => `${index + 1}. ${line.trim()}`).join('\n');
        }
        return '1. List item 1\n2. List item 2\n3. List item 3';
      },
    },
    {
      id: 'task-list',
      name: 'Task List',
      description: 'Create a task list',
      icon: HiViewList,
      category: 'Lists',
      action: (selectedText = '') => {
        if (selectedText) {
          const lines = selectedText.split('\n');
          return lines.map(line => `- [ ] ${line.trim()}`).join('\n');
        }
        return '- [ ] Task 1\n- [ ] Task 2\n- [x] Completed task';
      },
    },
    {
      id: 'blockquote',
      name: 'Quote',
      description: 'Create a blockquote',
      icon: HiQuestionMarkCircle,
      category: 'Text Formatting',
      action: (selectedText = '') => {
        if (selectedText) {
          const lines = selectedText.split('\n');
          return lines.map(line => `> ${line}`).join('\n');
        }
        return '> This is a quote';
      },
    },
    {
      id: 'code-block',
      name: 'Code Block',
      description: 'Create a code block',
      icon: HiCode,
      shortcut: ['Ctrl', 'Shift', '`'],
      category: 'Code',
      action: (selectedText = '') => {
        const language = prompt('Enter programming language (optional):') || '';
        if (selectedText) {
          return `\`\`\`${language}\n${selectedText}\n\`\`\``;
        }
        return `\`\`\`${language}\n// Your code here\n\`\`\``;
      },
    },
    {
      id: 'horizontal-rule',
      name: 'Horizontal Rule',
      description: 'Insert a horizontal rule',
      icon: HiQuestionMarkCircle,
      category: 'Structure',
      action: () => {
        return '\n---\n';
      },
    },
  ];
};

/**
 * Format action button component
 */
const FormatActionButton = ({ 
  action, 
  onExecute 
}: { 
  action: FormattingAction; 
  onExecute: (result: string) => void;
}) => {
  const IconComponent = action.icon;

  const handleClick = () => {
    const selection = getCurrentSelection();
    const selectedText = selection?.text || '';
    const result = action.action(selectedText);
    onExecute(result);
    toast.success(`Applied ${action.name} formatting`);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
      <div className="flex items-center gap-3">
        <IconComponent className="h-5 w-5 text-violet-400" />
        <div>
          <h4 className="font-semibold text-neutral-200">{action.name}</h4>
          <p className="text-xs text-neutral-400">{action.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action.shortcut && (
          <div className="flex items-center gap-1">
            {action.shortcut.map((key, index) => (
              <Kbd key={index} className="text-xs">
                {key}
              </Kbd>
            ))}
          </div>
        )}
        <Button
          variant="default"
          size="sm"
          onClick={handleClick}
          className="bg-violet-600 hover:bg-violet-700"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

/**
 * Quick formatting shortcuts component props
 */
interface QuickFormattingProps {
  onInsert: (content: string) => void;
}

/**
 * Quick formatting shortcuts dialog component
 */
export const QuickFormatting = ({ onInsert }: QuickFormattingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const actions = createFormattingActions();
  const categories = ['All', ...Array.from(new Set(actions.map(a => a.category)))];

  const filteredActions = actions.filter(action => 
    selectedCategory === 'All' || action.category === selectedCategory
  );

  const handleExecuteAndClose = (result: string) => {
    onInsert(result);
    // Don't close automatically to allow multiple operations
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-neutral-300 hover:bg-zinc-800 transition"
          title="Quick Formatting"
          aria-label="Open quick formatting tools"
        >
          <HiLightningBolt className="text-xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-xl font-semibold">
            Quick Formatting
          </DialogTitle>
        </DialogHeader>
        
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-violet-600 hover:bg-violet-700" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-3">
            {filteredActions.map((action) => (
              <FormatActionButton
                key={action.id}
                action={action}
                onExecute={handleExecuteAndClose}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Keyboard Shortcuts Info */}
        <div className="mt-4 p-3 bg-neutral-800/30 rounded-lg">
          <p className="text-xs text-neutral-400">
            💡 <strong>Tip:</strong> Select text in the editor before clicking an action to apply formatting to your selection.
            Use keyboard shortcuts for faster formatting.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};