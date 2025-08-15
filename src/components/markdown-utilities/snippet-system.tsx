import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  HiTemplate,
  HiSearch,
  HiPlus,
  HiPencilAlt,
  HiTrash,
} from 'react-icons/hi';
import { toast } from 'sonner';
import { MarkdownSnippet, defaultSnippets } from '../../data/snippets';
import { VariableInputDialog } from './variable-input-dialog';
import { CreateSnippetDialog } from './create-snippet-dialog';
import { CustomSnippetsManager } from '../../lib/custom-snippets-manager';

/**
 * Process snippet template with variables
 */
const processSnippetTemplate = (
  template: string,
  variables: Record<string, string>
): string => {
  let processed = template;
  Object.entries(variables).forEach(([variable, value]) => {
    const placeholder = `{{${variable}}}`;
    processed = processed.replace(new RegExp(placeholder, 'g'), value);
  });
  return processed;
};

/**
 * Individual snippet item component
 */
const SnippetItem = ({
  snippet,
  onInsert,
  onShowVariableDialog,
  onDelete,
  onEdit,
}: {
  snippet: MarkdownSnippet;
  onInsert: (content: string) => void;
  onShowVariableDialog: (snippet: MarkdownSnippet) => void;
  onDelete?: (snippet: MarkdownSnippet) => void;
  onEdit?: (snippet: MarkdownSnippet) => void;
}) => {
  const handleInsert = () => {
    if (snippet.variables && snippet.variables.length > 0) {
      onShowVariableDialog(snippet);
    } else {
      onInsert(snippet.template);
      toast.success(`Inserted snippet: ${snippet.name}`);
    }
  };

  const isCustom = CustomSnippetsManager.isCustomSnippet(snippet.id);

  return (
    <div className="p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-neutral-200">{snippet.name}</h4>
            <Badge variant="outline" className="text-xs">
              {snippet.category}
            </Badge>
            {isCustom && (
              <Badge
                variant="secondary"
                className="text-xs bg-violet-600/20 text-violet-300">
                Custom
              </Badge>
            )}
          </div>
          <p className="text-sm text-neutral-400 mb-3">{snippet.description}</p>
          {snippet.variables && snippet.variables.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-neutral-500 mb-1">Variables:</p>
              <div className="flex flex-wrap gap-1">
                {snippet.variables.map((variable) => (
                  <Badge key={variable} variant="secondary" className="text-xs">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-2">
          {isCustom && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(snippet)}
              className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10">
              <HiPencilAlt className="h-4 w-4" />
            </Button>
          )}
          {isCustom && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(snippet)}
              className="border-red-600/50 text-red-400 hover:bg-red-600/10">
              <HiTrash className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={handleInsert}
            className="bg-violet-600 hover:bg-violet-700">
            <HiPlus className="h-4 w-4 mr-1" />
            Insert
          </Button>
        </div>
      </div>
      <details className="mt-2">
        <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-400">
          Preview Template
        </summary>
        <pre className="text-xs text-neutral-400 bg-neutral-900 p-2 rounded mt-2 overflow-x-auto">
          {snippet.template.slice(0, 200)}
          {snippet.template.length > 200 && '...'}
        </pre>
      </details>
    </div>
  );
};

/**
 * Snippet system component props
 */
interface SnippetSystemProps {
  onInsert: (content: string) => void;
}

/**
 * Markdown snippet system dialog component
 */
export const SnippetSystem = ({ onInsert }: SnippetSystemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showVariableDialog, setShowVariableDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<MarkdownSnippet | null>(
    null
  );
  const [currentSnippet, setCurrentSnippet] = useState<MarkdownSnippet | null>(
    null
  );
  const [customSnippets, setCustomSnippets] = useState<MarkdownSnippet[]>([]);

  const allSnippets = [...defaultSnippets, ...customSnippets];
  const categories = [
    'All',
    ...Array.from(new Set(allSnippets.map((s: MarkdownSnippet) => s.category))),
  ];

  useEffect(() => {
    setCustomSnippets(CustomSnippetsManager.getCustomSnippets());
  }, []);

  const filteredSnippets = allSnippets.filter((snippet: MarkdownSnippet) => {
    const matchesSearch =
      snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || snippet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInsertAndClose = (content: string) => {
    onInsert(content);
    setIsOpen(false);
  };

  const handleShowVariableDialog = (snippet: MarkdownSnippet) => {
    setCurrentSnippet(snippet);
    setShowVariableDialog(true);
  };

  const handleVariableSubmit = (values: Record<string, string>) => {
    if (currentSnippet) {
      const processedContent = processSnippetTemplate(
        currentSnippet.template,
        values
      );
      handleInsertAndClose(processedContent);
      toast.success(`Inserted snippet: ${currentSnippet.name}`);
    }
    setShowVariableDialog(false);
    setCurrentSnippet(null);
  };

  const handleCreateSnippet = (snippetData: Omit<MarkdownSnippet, 'id'>) => {
    const newSnippet = CustomSnippetsManager.saveCustomSnippet(snippetData);
    setCustomSnippets(CustomSnippetsManager.getCustomSnippets());
    toast.success(`Created snippet: ${newSnippet.name}`);
  };

  const handleEditSnippet = (snippet: MarkdownSnippet) => {
    setEditingSnippet(snippet);
    setShowCreateDialog(true);
  };

  const handleUpdateSnippet = (
    id: string,
    snippetData: Omit<MarkdownSnippet, 'id'>
  ) => {
    if (CustomSnippetsManager.updateCustomSnippet(id, snippetData)) {
      setCustomSnippets(CustomSnippetsManager.getCustomSnippets());
      toast.success(`Updated snippet: ${snippetData.name}`);
    }
    setEditingSnippet(null);
  };

  const handleDeleteSnippet = (snippet: MarkdownSnippet) => {
    if (CustomSnippetsManager.deleteCustomSnippet(snippet.id)) {
      setCustomSnippets(CustomSnippetsManager.getCustomSnippets());
      toast.success(`Deleted snippet: ${snippet.name}`);
    }
  };

  const handleCloseCreateDialog = (open: boolean) => {
    setShowCreateDialog(open);
    if (!open) {
      setEditingSnippet(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-neutral-300 hover:bg-zinc-800 transition"
            title="Insert Snippet"
            aria-label="Open snippet library">
            <HiTemplate className="text-xl" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-neutral-200 text-xl font-semibold">
                Snippet Library
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateDialog(true)}
                className="border-violet-600/50 text-violet-400 hover:bg-violet-600/10 mr-4">
                <HiPlus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </div>
          </DialogHeader>

          {/* Search and Filters */}
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-200"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-200 text-sm">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <ScrollArea className="max-h-[50vh] pr-4">
            <div className="space-y-4">
              {filteredSnippets.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <HiTemplate className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No snippets found matching your criteria.</p>
                </div>
              ) : (
                filteredSnippets.map((snippet) => (
                  <SnippetItem
                    key={snippet.id}
                    snippet={snippet}
                    onInsert={handleInsertAndClose}
                    onShowVariableDialog={handleShowVariableDialog}
                    onDelete={handleDeleteSnippet}
                    onEdit={handleEditSnippet}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {currentSnippet && (
        <VariableInputDialog
          isOpen={showVariableDialog}
          onOpenChange={setShowVariableDialog}
          variables={currentSnippet.variables || []}
          onSubmit={handleVariableSubmit}
          snippetName={currentSnippet.name}
        />
      )}

      <CreateSnippetDialog
        isOpen={showCreateDialog}
        onOpenChange={handleCloseCreateDialog}
        onSave={handleCreateSnippet}
        editingSnippet={editingSnippet}
        onUpdate={handleUpdateSnippet}
      />
    </>
  );
};
