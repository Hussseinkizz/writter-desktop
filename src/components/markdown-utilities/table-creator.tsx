import { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { HiTable, HiPlus, HiMinus } from 'react-icons/hi';
import { toast } from 'sonner';

/**
 * Table alignment options
 */
type TableAlignment = 'left' | 'center' | 'right';

/**
 * Table cell data structure
 */
interface TableCell {
  content: string;
  alignment: TableAlignment;
}

/**
 * Table configuration
 */
interface TableConfig {
  rows: number;
  columns: number;
  hasHeader: boolean;
  headers: string[];
  alignments: TableAlignment[];
  cells: string[][];
}

/**
 * Create default table configuration
 */
const createDefaultTableConfig = (): TableConfig => {
  return {
    rows: 3,
    columns: 3,
    hasHeader: true,
    headers: ['Column 1', 'Column 2', 'Column 3'],
    alignments: ['left', 'left', 'left'],
    cells: [
      ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
      ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
      ['Row 3 Col 1', 'Row 3 Col 2', 'Row 3 Col 3'],
    ],
  };
};

/**
 * Generate markdown table from configuration
 */
const generateMarkdownTable = (config: TableConfig): string => {
  const { columns, hasHeader, headers, alignments, cells } = config;
  
  let table = '';
  
  // Add header row if enabled
  if (hasHeader) {
    table += '|';
    for (let col = 0; col < columns; col++) {
      table += ` ${headers[col] || `Header ${col + 1}`} |`;
    }
    table += '\n';
    
    // Add separator row with alignment
    table += '|';
    for (let col = 0; col < columns; col++) {
      const alignment = alignments[col] || 'left';
      let separator = '----------';
      
      if (alignment === 'center') {
        separator = ':--------:';
      } else if (alignment === 'right') {
        separator = '---------:';
      } else {
        separator = '----------';
      }
      
      table += `${separator}|`;
    }
    table += '\n';
  }
  
  // Add data rows
  for (let row = 0; row < cells.length; row++) {
    table += '|';
    for (let col = 0; col < columns; col++) {
      const cellContent = cells[row]?.[col] || '';
      table += ` ${cellContent} |`;
    }
    table += '\n';
  }
  
  return table;
};

/**
 * Table cell input component
 */
const TableCellInput = ({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`text-sm bg-neutral-800 border-neutral-600 ${className}`}
    />
  );
};

/**
 * Table creator component props
 */
interface TableCreatorProps {
  onInsert: (content: string) => void;
}

/**
 * Markdown table creation utility component
 */
export const TableCreator = ({ onInsert }: TableCreatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<TableConfig>(createDefaultTableConfig());

  // Update table dimensions
  const updateDimensions = (rows: number, columns: number) => {
    const newConfig = { ...config };
    newConfig.rows = Math.max(1, Math.min(20, rows));
    newConfig.columns = Math.max(1, Math.min(10, columns));
    
    // Adjust headers array
    const newHeaders = [...newConfig.headers];
    while (newHeaders.length < newConfig.columns) {
      newHeaders.push(`Column ${newHeaders.length + 1}`);
    }
    newConfig.headers = newHeaders.slice(0, newConfig.columns);
    
    // Adjust alignments array
    const newAlignments = [...newConfig.alignments];
    while (newAlignments.length < newConfig.columns) {
      newAlignments.push('left');
    }
    newConfig.alignments = newAlignments.slice(0, newConfig.columns);
    
    // Adjust cells array
    const newCells = [...newConfig.cells];
    while (newCells.length < newConfig.rows) {
      const newRow = new Array(newConfig.columns).fill('');
      newCells.push(newRow);
    }
    newConfig.cells = newCells.slice(0, newConfig.rows);
    
    // Ensure each row has the right number of columns
    newConfig.cells = newConfig.cells.map(row => {
      const newRow = [...row];
      while (newRow.length < newConfig.columns) {
        newRow.push('');
      }
      return newRow.slice(0, newConfig.columns);
    });
    
    setConfig(newConfig);
  };

  // Update header content
  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...config.headers];
    newHeaders[index] = value;
    setConfig({ ...config, headers: newHeaders });
  };

  // Update column alignment
  const updateAlignment = (index: number, alignment: TableAlignment) => {
    const newAlignments = [...config.alignments];
    newAlignments[index] = alignment;
    setConfig({ ...config, alignments: newAlignments });
  };

  // Update cell content
  const updateCell = (row: number, col: number, value: string) => {
    const newCells = [...config.cells];
    newCells[row][col] = value;
    setConfig({ ...config, cells: newCells });
  };

  // Insert table and close dialog
  const handleInsertTable = () => {
    const markdownTable = generateMarkdownTable(config);
    onInsert(markdownTable);
    setIsOpen(false);
    toast.success('Table inserted successfully!');
  };

  // Reset to default configuration
  const resetTable = () => {
    setConfig(createDefaultTableConfig());
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-neutral-300 hover:bg-zinc-800 transition"
          title="Create Table"
          aria-label="Open table creator"
        >
          <HiTable className="text-xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-xl font-semibold">
            Table Creator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Table Configuration */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-800/50 rounded-lg">
            <div className="space-y-2">
              <Label className="text-neutral-200">Rows</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateDimensions(config.rows - 1, config.columns)}
                  disabled={config.rows <= 1}
                  className="h-8 w-8 p-0"
                >
                  <HiMinus className="h-4 w-4" />
                </Button>
                <span className="text-neutral-200 text-sm font-mono w-8 text-center">
                  {config.rows}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateDimensions(config.rows + 1, config.columns)}
                  disabled={config.rows >= 20}
                  className="h-8 w-8 p-0"
                >
                  <HiPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-200">Columns</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateDimensions(config.rows, config.columns - 1)}
                  disabled={config.columns <= 1}
                  className="h-8 w-8 p-0"
                >
                  <HiMinus className="h-4 w-4" />
                </Button>
                <span className="text-neutral-200 text-sm font-mono w-8 text-center">
                  {config.columns}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateDimensions(config.rows, config.columns + 1)}
                  disabled={config.columns >= 10}
                  className="h-8 w-8 p-0"
                >
                  <HiPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-200">Header Row</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.hasHeader}
                  onCheckedChange={(checked) => setConfig({ ...config, hasHeader: checked })}
                />
                <span className="text-xs text-neutral-400">
                  {config.hasHeader ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetTable}
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Headers Configuration */}
          {config.hasHeader && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-200">Headers & Alignment</h3>
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${config.columns}, 1fr)` }}>
                {config.headers.map((header, index) => (
                  <div key={index} className="space-y-2">
                    <TableCellInput
                      value={header}
                      onChange={(value) => updateHeader(index, value)}
                      placeholder={`Header ${index + 1}`}
                    />
                    <Select
                      value={config.alignments[index]}
                      onValueChange={(value: TableAlignment) => updateAlignment(index, value)}
                    >
                      <SelectTrigger className="h-8 text-xs bg-neutral-800 border-neutral-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table Cells */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-neutral-200">Table Content</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {config.cells.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${config.columns}, 1fr)` }}
                >
                  {row.map((cell, colIndex) => (
                    <TableCellInput
                      key={`${rowIndex}-${colIndex}`}
                      value={cell}
                      onChange={(value) => updateCell(rowIndex, colIndex, value)}
                      placeholder={`R${rowIndex + 1}C${colIndex + 1}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-neutral-200">Preview</h3>
            <div className="p-4 bg-neutral-800/50 rounded-lg">
              <pre className="text-sm text-neutral-300 font-mono whitespace-pre-wrap overflow-x-auto">
                {generateMarkdownTable(config)}
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-700">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInsertTable}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Insert Table
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};