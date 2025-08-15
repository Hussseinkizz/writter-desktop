import { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface VariableInputDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variables: string[];
  onSubmit: (values: Record<string, string>) => void;
  snippetName: string;
}

export const VariableInputDialog = ({ 
  isOpen, 
  onOpenChange, 
  variables, 
  onSubmit, 
  snippetName 
}: VariableInputDialogProps) => {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
    setValues({});
    onOpenChange(false);
  };

  const handleCancel = () => {
    setValues({});
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200">
            Configure Snippet: {snippetName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
          {variables.map((variable) => (
            <div key={variable} className="space-y-2">
              <Label 
                htmlFor={variable} 
                className="text-sm font-medium text-neutral-300 capitalize"
              >
                {variable.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              <Input
                id={variable}
                value={values[variable] || ''}
                onChange={(e) => setValues(prev => ({ 
                  ...prev, 
                  [variable]: e.target.value 
                }))}
                placeholder={`Enter ${variable}...`}
                className="bg-neutral-800 border-neutral-700 text-neutral-200"
              />
            </div>
          ))}
          
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
            >
              Insert Snippet
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};