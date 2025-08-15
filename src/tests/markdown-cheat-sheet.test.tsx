import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MarkdownCheatSheet } from '../components/markdown-utilities/markdown-cheat-sheet';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('MarkdownCheatSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cheat sheet trigger button', () => {
    render(<MarkdownCheatSheet />);
    const triggerButton = screen.getByRole('button', { name: /open markdown cheat sheet/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it('opens dialog when trigger button is clicked', async () => {
    render(<MarkdownCheatSheet />);
    const triggerButton = screen.getByRole('button', { name: /open markdown cheat sheet/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Markdown Cheat Sheet')).toBeInTheDocument();
    });
  });

  it('displays cheat sheet categories and items', async () => {
    render(<MarkdownCheatSheet />);
    const triggerButton = screen.getByRole('button', { name: /open markdown cheat sheet/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      // Check for categories
      expect(screen.getByText('Headers')).toBeInTheDocument();
      expect(screen.getByText('Text Formatting')).toBeInTheDocument();
      expect(screen.getByText('Lists')).toBeInTheDocument();
      expect(screen.getByText('Links & Images')).toBeInTheDocument();
      expect(screen.getByText('Code')).toBeInTheDocument();
      expect(screen.getByText('Tables')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });
  });

  it('allows copying syntax to clipboard', async () => {
    render(<MarkdownCheatSheet />);
    const triggerButton = screen.getByRole('button', { name: /open markdown cheat sheet/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const copyButtons = screen.getAllByTitle('Copy to clipboard');
      fireEvent.click(copyButtons[0]);
    });
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('displays correct syntax examples', async () => {
    render(<MarkdownCheatSheet />);
    const triggerButton = screen.getByRole('button', { name: /open markdown cheat sheet/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      // Check for some common syntax examples
      expect(screen.getByText('# Header 1')).toBeInTheDocument();
      expect(screen.getByText('**bold text**')).toBeInTheDocument();
      expect(screen.getByText('*italic text*')).toBeInTheDocument();
      expect(screen.getByText('- Item 1')).toBeInTheDocument();
    });
  });
});