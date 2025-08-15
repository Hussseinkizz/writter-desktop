import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  HiCheck,
  HiClock,
  HiPlus,
  HiTrash,
  HiClipboardList,
  HiCalendar,
} from 'react-icons/hi';
import { toast } from 'sonner';
import { z } from 'zod';

/**
 * Todo item validation schema
 */
const todoItemSchema = z.object({
  id: z.string().min(1, 'Todo ID is required'),
  text: z.string().min(1, 'Todo text is required'),
  status: z.enum(['todo', 'done', 'pending'], {
    errorMap: () => ({ message: 'Status must be todo, done, or pending' }),
  }),
  createdAt: z.date(),
  completedAt: z.date().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

/**
 * Todo item interface
 */
type TodoItem = z.infer<typeof todoItemSchema>;

/**
 * Validation helper functions
 */
const validateTodoItem = (
  item: unknown
): { isValid: boolean; error?: string; data?: TodoItem } => {
  try {
    const validatedItem = todoItemSchema.parse(item);
    return { isValid: true, data: validatedItem };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors.map((e) => e.message).join(', '),
      };
    }
    return { isValid: false, error: 'Invalid todo item' };
  }
};

/**
 * Todo manager storage key
 */
const STORAGE_KEY = 'writter-todo-manager';

/**
 * Create a new todo item with validation
 */
const createTodoItem = (text: string): TodoItem | null => {
  try {
    const item = {
      id: crypto.randomUUID(),
      text: text.trim(),
      status: 'todo' as const,
      createdAt: new Date(),
      priority: 'medium' as const,
    };

    const validation = validateTodoItem(item);
    if (!validation.isValid) {
      toast.error(`Invalid todo item: ${validation.error}`);
      return null;
    }

    return validation.data!;
  } catch (error) {
    toast.error('Failed to create todo item');
    return null;
  }
};

/**
 * Load todos from localStorage with validation
 */
const loadTodos = (): TodoItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const validatedTodos: TodoItem[] = [];

      for (const item of parsed) {
        const itemWithDates = {
          ...item,
          createdAt: new Date(item.createdAt),
          completedAt: item.completedAt
            ? new Date(item.completedAt)
            : undefined,
        };

        const validation = validateTodoItem(itemWithDates);
        if (validation.isValid && validation.data) {
          validatedTodos.push(validation.data);
        } else {
          console.warn('Invalid todo item found in storage:', validation.error);
        }
      }

      return validatedTodos;
    }
  } catch (error) {
    console.error('Failed to load todos:', error);
    toast.error('Failed to load todos');
  }
  return [];
};

/**
 * Save todos to localStorage with validation
 */
const saveTodos = (todos: TodoItem[]): void => {
  try {
    // Validate all todos before saving
    const validTodos = todos.filter((todo) => {
      const validation = validateTodoItem(todo);
      if (!validation.isValid) {
        console.warn('Invalid todo item, skipping save:', validation.error);
        return false;
      }
      return true;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(validTodos));
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
  onPriorityChange,
}: {
  item: TodoItem;
  onStatusChange: (id: string, status: TodoItem['status']) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: TodoItem['priority']) => void;
}) => {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'done':
        return <HiCheck className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <HiClock className="h-5 w-5 text-yellow-500" />;
      default:
        return (
          <div className="h-5 w-5 border-2 border-neutral-400 rounded-md" />
        );
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'done':
        return 'text-green-400 line-through opacity-75';
      case 'pending':
        return 'text-yellow-300';
      default:
        return 'text-neutral-100';
    }
  };

  const getPriorityColor = () => {
    switch (item.priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'low':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  const getPriorityIcon = () => {
    switch (item.priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⚪';
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
    <div className="group relative flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-neutral-800/60 to-neutral-800/40 hover:from-neutral-800/80 hover:to-neutral-800/60 transition-all duration-200 border border-neutral-700/50 hover:border-neutral-600/50">
      <button
        onClick={cycleStatus}
        className="flex-shrink-0 hover:scale-110 transition-all duration-200 p-1 rounded-lg hover:bg-neutral-700/50"
        title={`Status: ${item.status} (click to change)`}>
        {getStatusIcon()}
      </button>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p
            className={`${getStatusColor()} text-sm font-medium leading-relaxed break-words flex-1`}>
            {item.text}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 h-8 w-8 flex-shrink-0"
            title="Delete todo">
            <HiTrash className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className={`cursor-pointer transition-all duration-200 hover:scale-105 px-2 py-1 flex-shrink-0 ${getPriorityColor()}`}
            onClick={cyclePriority}
            title="Click to change priority">
            <span className="mr-1">{getPriorityIcon()}</span>
            {item.priority}
          </Badge>

          <div className="flex items-center gap-1 text-neutral-400 text-xs flex-shrink-0">
            <HiCalendar className="h-3 w-3" />
            <span>
              {item.status === 'done' && item.completedAt
                ? `Completed ${item.completedAt.toLocaleDateString()}`
                : `Created ${item.createdAt.toLocaleDateString()}`}
            </span>
          </div>
        </div>
      </div>
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
  const [filter, setFilter] = useState<'all' | 'todo' | 'pending' | 'done'>(
    'all'
  );

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
    if (!newTodo) {
      // Error already shown by createTodoItem
      return;
    }

    setTodos((prev) => [newTodo, ...prev]);
    setNewTodoText('');
    toast.success('Todo added successfully');
  };

  const updateTodoStatus = (id: string, status: TodoItem['status']) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status,
              completedAt: status === 'done' ? new Date() : undefined,
            }
          : todo
      )
    );

    const statusMessages = {
      todo: 'Moved to todo',
      pending: 'Marked as pending',
      done: 'Marked as completed',
    };
    toast.success(statusMessages[status]);
  };

  const updateTodoPriority = (id: string, priority: TodoItem['priority']) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast.success('Todo deleted');
  };

  const clearCompleted = () => {
    const completedCount = todos.filter(
      (todo) => todo.status === 'done'
    ).length;
    setTodos((prev) => prev.filter((todo) => todo.status !== 'done'));
    toast.success(`Cleared ${completedCount} completed todos`);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  const getStats = () => {
    const total = todos.length;
    const done = todos.filter((t) => t.status === 'done').length;
    const pending = todos.filter((t) => t.status === 'pending').length;
    const todo = todos.filter((t) => t.status === 'todo').length;
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
${
  todos
    .filter((t) => t.status === 'todo')
    .map((t) => `- [ ] ${t.text} (${t.priority} priority)`)
    .join('\n') || 'No todo items'
}

## ⏳ Pending
${
  todos
    .filter((t) => t.status === 'pending')
    .map((t) => `- [ ] ${t.text} (${t.priority} priority)`)
    .join('\n') || 'No pending items'
}

## ✅ Completed
${
  todos
    .filter((t) => t.status === 'done')
    .map(
      (t) =>
        `- [x] ${t.text} (completed ${t.completedAt?.toLocaleDateString()})`
    )
    .join('\n') || 'No completed items'
}

---
*Generated by Writter Todo Manager on ${new Date().toLocaleString()}*`;

    navigator.clipboard
      .writeText(markdown)
      .then(() => {
        toast.success('Todo list copied to clipboard as Markdown!');
      })
      .catch(() => {
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
          aria-label="Open todo manager">
          <HiClipboardList className="text-xl" />
          {stats.todo + stats.pending > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-violet-500 rounded-full text-xs"></span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-neutral-900 border-neutral-700 pr-8">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-xl font-semibold flex items-center gap-2">
            <HiClipboardList className="text-violet-400" />
            Todo Manager
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-1">
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-neutral-800/30 rounded-lg mx-1">
              <div className="text-center">
                <div className="text-lg font-semibold text-neutral-200">
                  {stats.total}
                </div>
                <div className="text-xs text-neutral-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-violet-500">
                  {stats.todo}
                </div>
                <div className="text-xs text-neutral-400">Todo</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-400">
                  {stats.pending}
                </div>
                <div className="text-xs text-neutral-400">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-400">
                  {stats.done}
                </div>
                <div className="text-xs text-neutral-400">Done</div>
              </div>
            </div>

            {/* Add New Todo */}
            <div className="flex gap-3 mx-1">
              <Input
                placeholder="Add a new todo item..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                className="flex-1 bg-neutral-800 border-neutral-700 text-neutral-200 h-11"
              />
              <Button
                onClick={addTodo}
                className="bg-violet-600 hover:bg-violet-700 h-11 px-4">
                <HiPlus className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters and Actions */}
            <div className="flex items-center justify-between gap-4 mx-1">
              <div className="flex items-center gap-3 w-fit">
                {/* <label className="text-sm font-medium text-neutral-300 whitespace-nowrap">
                  Filter:
                </label> */}
                <Select
                  value={filter}
                  onValueChange={(value) => setFilter(value as typeof filter)}>
                  <SelectTrigger className="w-48 bg-neutral-800 border-neutral-700 text-neutral-200 h-10">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    <SelectItem
                      value="all"
                      className="text-neutral-200 focus:bg-neutral-700">
                      All ({stats.total})
                    </SelectItem>
                    <SelectItem
                      value="todo"
                      className="text-neutral-200 focus:bg-neutral-700">
                      📝 Todo ({stats.todo})
                    </SelectItem>
                    <SelectItem
                      value="pending"
                      className="text-neutral-200 focus:bg-neutral-700">
                      ⏳ Pending ({stats.pending})
                    </SelectItem>
                    <SelectItem
                      value="done"
                      className="text-neutral-200 focus:bg-neutral-700">
                      ✅ Done ({stats.done})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToMarkdown}
                  disabled={todos.length === 0}
                  title="Export to Markdown"
                  className="h-10 px-4">
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCompleted}
                  disabled={stats.done === 0}
                  className="text-red-400 hover:text-red-300 h-10 px-4">
                  <HiTrash className="h-4 w-4 mr-2" />
                  Clear Done
                </Button>
              </div>
            </div>

            {/* Todo List */}
            <div className="mx-1">
              <ScrollArea className="h-[45vh]">
                <div className="space-y-3 pr-3">
                  {filteredTodos.length === 0 ? (
                    <div className="text-center py-12 text-neutral-400">
                      <HiClipboardList className="h-16 w-16 mx-auto mb-6 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        {filter === 'all'
                          ? 'No todos yet'
                          : `No ${filter} items`}
                      </p>
                      <p className="text-sm">
                        {filter === 'all'
                          ? 'Add your first todo above!'
                          : 'Try switching to a different filter.'}
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
            </div>

            {/* Usage Tip */}
            <div className="p-4 bg-neutral-800/20 rounded-lg mx-1 border border-neutral-700/30">
              <p className="text-xs text-neutral-400 leading-relaxed">
                💡 <strong className="text-neutral-300">Tips:</strong>
                <br />
                Click the checkbox to cycle through statuses (todo → pending →
                done). <br />
                Click priority badges to change priority. Use Export to copy as
                Markdown.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
