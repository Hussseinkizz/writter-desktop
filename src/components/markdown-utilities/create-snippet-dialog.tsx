import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { HiX, HiPlus } from 'react-icons/hi';
import { MarkdownSnippet } from '../../data/snippets';

interface CreateSnippetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (snippet: Omit<MarkdownSnippet, 'id'>) => void;
  editingSnippet?: MarkdownSnippet | null;
  onUpdate?: (id: string, snippet: Omit<MarkdownSnippet, 'id'>) => void;
}

export const CreateSnippetDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSave,
  editingSnippet,
  onUpdate
}: CreateSnippetDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [template, setTemplate] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState('');

  const isEditing = !!editingSnippet;

  useEffect(() => {
    if (editingSnippet) {
      setName(editingSnippet.name);
      setDescription(editingSnippet.description);
      setCategory(editingSnippet.category);
      setTemplate(editingSnippet.template);
      setVariables(editingSnippet.variables || []);
    } else {
      handleReset();
    }
  }, [editingSnippet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !template.trim()) {
      return;
    }

    const snippetData = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim() || 'Custom',
      template: template.trim(),
      variables: variables.length > 0 ? variables : undefined
    };

    if (isEditing && editingSnippet && onUpdate) {
      onUpdate(editingSnippet.id, snippetData);
    } else {
      onSave(snippetData);
    }

    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setName('');
    setDescription('');
    setCategory('');
    setTemplate('');
    setVariables([]);
    setNewVariable('');
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  const addVariable = () => {
    if (newVariable.trim() && !variables.includes(newVariable.trim())) {
      setVariables([...variables, newVariable.trim()]);
      setNewVariable('');
    }
  };

  const removeVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addVariable();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200">
            {isEditing ? 'Edit Snippet' : 'Create Custom Snippet'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-neutral-300">
                Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., API Documentation"
                className="bg-neutral-800 border-neutral-700 text-neutral-200"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-neutral-300">
                Category
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Documentation"
                className="bg-neutral-800 border-neutral-700 text-neutral-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-neutral-300">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the snippet"
              className="bg-neutral-800 border-neutral-700 text-neutral-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template" className="text-sm font-medium text-neutral-300">
              Template *
            </Label>
            <Textarea
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Enter your markdown template here. Use {{variable}} for placeholders."
              className="bg-neutral-800 border-neutral-700 text-neutral-200 min-h-[120px] font-mono text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-neutral-300">
              Variables
            </Label>
            <div className="flex gap-2">
              <Input
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add variable name"
                className="bg-neutral-800 border-neutral-700 text-neutral-200 flex-1"
              />
              <Button
                type="button"
                onClick={addVariable}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700"
              >
                <HiPlus className="h-4 w-4" />
              </Button>
            </div>
            
            {variables.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {variables.map((variable) => (
                  <Badge 
                    key={variable} 
                    variant="secondary" 
                    className="text-xs flex items-center gap-1"
                  >
                    {variable}
                    <button
                      type="button"
                      onClick={() => removeVariable(variable)}
                      className="ml-1 hover:text-red-400"
                    >
                      <HiX className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-violet-600 hover:bg-violet-700"
              disabled={!name.trim() || !template.trim()}
            >
              {isEditing ? 'Update Snippet' : 'Save Snippet'}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};