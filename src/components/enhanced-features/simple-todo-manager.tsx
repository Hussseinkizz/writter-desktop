import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  HiCheck, 
  HiClock, 
  HiPlus, 
  HiTrash, 
  HiClipboardList,
  HiRefresh
} from 'react-icons/hi';
import { toast } from 'sonner';

/**
 * Todo item interface
 */
interface TodoItem {
  id: string;
  text: string;
  status: 'todo' | 'done' | 'pending';
  createdAt: Date;
  completedAt?: Date;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Todo manager storage key
 */
const STORAGE_KEY = 'writter-todo-manager';

/**
 * Create a new todo item
 */
const createTodoItem = (text: string): TodoItem => {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    status: 'todo',
    createdAt: new Date(),
    priority: 'medium',
  };
};

/**
 * Load todos from localStorage
 */
const loadTodos = (): TodoItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
      }));
    }
  } catch (error) {
    console.error('Failed to load todos:', error);
  }
  return [];
};

/**
 * Save todos to localStorage
 */
const saveTodos = (todos: TodoItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos:', error);
    toast.error('Failed to save todos');
  }
};

/**
 * Individual todo item component
 */
const TodoItemComponent = ({ 
  item, 
  onStatusChange, 
  onDelete,
  onPriorityChange 
}: { 
  item: TodoItem; 
  onStatusChange: (id: string, status: TodoItem['status']) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: TodoItem['priority']) => void;
}) => {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'done':
        return <HiCheck className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <HiClock className="h-4 w-4 text-yellow-500" />;
      default:
        return <div className="h-4 w-4 border border-neutral-500 rounded" />;
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'done':
        return 'text-green-400 line-through';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-neutral-200';
    }
  };

  const getPriorityColor = () => {
    switch (item.priority) {
      case 'high':
        return 'bg-red-600/20 text-red-400';
      case 'low':
        return 'bg-blue-600/20 text-blue-400';
      default:
        return 'bg-amber-600/20 text-amber-400';
    }
  };

  const cycleStatus = () => {
    const statuses: TodoItem['status'][] = ['todo', 'pending', 'done'];
    const currentIndex = statuses.indexOf(item.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onStatusChange(item.id, nextStatus);
  };

  const cyclePriority = () => {
    const priorities: TodoItem['priority'][] = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(item.priority || 'medium');
    const nextPriority = priorities[(currentIndex + 1) % priorities.length];
    onPriorityChange(item.id, nextPriority);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors group">
      <button
        onClick={cycleStatus}
        className="flex-shrink-0 hover:scale-110 transition-transform"
        title={`Status: ${item.status} (click to change)`}
      >
        {getStatusIcon()}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={`${getStatusColor()} break-words`}>
          {item.text}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Badge 
            variant="secondary" 
            className={`text-xs cursor-pointer ${getPriorityColor()}`}
            onClick={cyclePriority}
            title="Click to change priority"
          >
            {item.priority}
          </Badge>
          <span className="text-xs text-neutral-500">
            {item.status === 'done' && item.completedAt 
              ? `Completed ${item.completedAt.toLocaleDateString()}`
              : `Created ${item.createdAt.toLocaleDateString()}`
            }
          </span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
        title="Delete todo"
      >
        <HiTrash className="h-4 w-4" />
      </Button>
    </div>
  );
};

/**
 * Simple todo manager dialog component
 */
export const SimpleTodoManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [filter, setFilter] = useState<'all' | 'todo' | 'pending' | 'done'>('all');

  // Load todos on mount
  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  // Save todos whenever the list changes
  useEffect(() => {
    if (todos.length >= 0) {
      saveTodos(todos);
    }
  }, [todos]);

  const addTodo = () => {
    const text = newTodoText.trim();
    if (!text) {
      toast.error('Please enter a todo item');
      return;
    }

    const newTodo = createTodoItem(text);
    setTodos(prev => [newTodo, ...prev]);
    setNewTodoText('');
    toast.success('Todo added successfully');
  };

  const updateTodoStatus = (id: string, status: TodoItem['status']) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            status, 
            completedAt: status === 'done' ? new Date() : undefined 
          }
        : todo
    ));
    
    const statusMessages = {
      todo: 'Moved to todo',
      pending: 'Marked as pending',
      done: 'Marked as completed'
    };
    toast.success(statusMessages[status]);
  };

  const updateTodoPriority = (id: string, priority: TodoItem['priority']) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, priority } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast.success('Todo deleted');
  };

  const clearCompleted = () => {
    const completedCount = todos.filter(todo => todo.status === 'done').length;
    setTodos(prev => prev.filter(todo => todo.status !== 'done'));
    toast.success(`Cleared ${completedCount} completed todos`);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  const getStats = () => {
    const total = todos.length;
    const done = todos.filter(t => t.status === 'done').length;
    const pending = todos.filter(t => t.status === 'pending').length;
    const todo = todos.filter(t => t.status === 'todo').length;
    return { total, done, pending, todo };
  };

  const stats = getStats();

  const exportToMarkdown = () => {
    const markdown = `# Todo List - ${new Date().toLocaleDateString()}

## 📋 Summary
- Total: ${stats.total}
- ✅ Completed: ${stats.done}
- ⏳ Pending: ${stats.pending}
- 📝 Todo: ${stats.todo}

## 📝 Todo
${todos.filter(t => t.status === 'todo').map(t => `- [ ] ${t.text} (${t.priority} priority)`).join('\n') || 'No todo items'}

## ⏳ Pending
${todos.filter(t => t.status === 'pending').map(t => `- [ ] ${t.text} (${t.priority} priority)`).join('\n') || 'No pending items'}

## ✅ Completed
${todos.filter(t => t.status === 'done').map(t => `- [x] ${t.text} (completed ${t.completedAt?.toLocaleDateString()})`).join('\n') || 'No completed items'}

---
*Generated by Writter Todo Manager on ${new Date().toLocaleString()}*`;

    navigator.clipboard.writeText(markdown).then(() => {
      toast.success('Todo list copied to clipboard as Markdown!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-neutral-300 hover:bg-zinc-800 transition relative"
          title="Todo Manager"
          aria-label="Open todo manager"
        >
          <HiClipboardList className="text-xl" />
          {stats.todo + stats.pending > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-violet-500 rounded-full text-xs"></span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-xl font-semibold flex items-center gap-2">
            <HiClipboardList className="text-violet-400" />
            Todo Manager
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 p-4 bg-neutral-800/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-neutral-200">{stats.total}</div>
              <div className="text-xs text-neutral-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-400">{stats.todo}</div>
              <div className="text-xs text-neutral-400">Todo</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-400">{stats.pending}</div>
              <div className="text-xs text-neutral-400">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-400">{stats.done}</div>
              <div className="text-xs text-neutral-400">Done</div>
            </div>
          </div>

          {/* Add New Todo */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a new todo item..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1 bg-neutral-800 border-neutral-700 text-neutral-200"
            />
            <Button onClick={addTodo} className="bg-violet-600 hover:bg-violet-700">
              <HiPlus className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'todo', 'pending', 'done'] as const).map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterOption)}
                  className={filter === filterOption ? "bg-violet-600 hover:bg-violet-700" : ""}
                >
                  {filterOption === 'all' ? 'All' : filterOption}
                  {filterOption !== 'all' && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {stats[filterOption]}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToMarkdown}
                disabled={todos.length === 0}
                title="Export to Markdown"
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompleted}
                disabled={stats.done === 0}
                className="text-red-400 hover:text-red-300"
              >
                <HiTrash className="h-4 w-4 mr-1" />
                Clear Done
              </Button>
            </div>
          </div>

          {/* Todo List */}
          <ScrollArea className="h-[50vh]">
            <div className="space-y-2">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <HiClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {filter === 'all' 
                      ? 'No todos yet. Add one above!' 
                      : `No ${filter} items.`
                    }
                  </p>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoItemComponent
                    key={todo.id}
                    item={todo}
                    onStatusChange={updateTodoStatus}
                    onDelete={deleteTodo}
                    onPriorityChange={updateTodoPriority}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Usage Tip */}
          <div className="p-3 bg-neutral-800/20 rounded-lg">
            <p className="text-xs text-neutral-400">
              💡 <strong>Tips:</strong> Click the checkbox to cycle through statuses (todo → pending → done). 
              Click priority badges to change priority. Use Export to copy as Markdown.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};