import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SnippetSystem } from '../components/markdown-utilities/snippet-system';

// Mock the prompt function
global.prompt = vi.fn();

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SnippetSystem', () => {
  const mockOnInsert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnInsert.mockClear();
  });

  it('renders snippet system trigger button', () => {
    render(<SnippetSystem onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open snippet library/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it('opens dialog when trigger button is clicked', async () => {
    render(<SnippetSystem onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open snippet library/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Snippet Library')).toBeInTheDocument();
    });
  });

  it('displays search functionality', async () => {
    render(<SnippetSystem onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open snippet library/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search snippets...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('displays category filters', async () => {
    render(<SnippetSystem onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open snippet library/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const categorySelect = screen.getByDisplayValue('All');
      expect(categorySelect).toBeInTheDocument();
    });
  });

  it('displays default snippets', async () => {
    render(<SnippetSystem onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open snippet library/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Blog Post Front Matter')).toBeInTheDocument();
      expect(screen.getByText('Simple Table')).toBeInTheDocument();
      expect(screen.getByText('Meeting Notes')).toBeInTheDocument();
    });
  });

  it('filters snippets by search query', async () => {
    render(<SnippetSystem onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open snippet library/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search snippets...');
      fireEvent.change(searchInput, { target: { value: 'table' } });
      
      expect(screen.getByText('Simple Table')).toBeInTheDocument();
      expect(screen.queryByText('Blog Post Front Matter')).not.toBeInTheDocument();
    });
  });

  it('inserts snippet when insert button is clicked', async () => {
    // Mock prompt to return values for variables
    (global.prompt as any)
      .mockReturnValueOnce('Test Title')
      .mockReturnValueOnce('2024-01-01')
      .mockReturnValueOnce('Test Author')
      .mockReturnValueOnce('tag1, tag2')
      .mockReturnValueOnce('This is test content');

    render(<SnippetSystem onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open snippet library/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const insertButtons = screen.getAllByText('Insert');
      fireEvent.click(insertButtons[0]); // Click first insert button
    });
    
    expect(mockOnInsert).toHaveBeenCalled();
  });

  it('shows snippet preview on details expansion', async () => {
    render(<SnippetSystem onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open snippet library/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const previewToggle = screen.getAllByText('Preview Template')[0];
      fireEvent.click(previewToggle);
      
      // Should show template content
      const templateContent = screen.getAllByText(/---/)[0];
      expect(templateContent).toBeInTheDocument();
    });
  });
});