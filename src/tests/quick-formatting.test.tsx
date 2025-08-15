import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuickFormatting } from '../components/markdown-utilities/quick-formatting';

// Mock window.getSelection
Object.defineProperty(window, 'getSelection', {
  writable: true,
  value: vi.fn(() => ({
    rangeCount: 1,
    getRangeAt: vi.fn(() => ({
      toString: () => 'selected text',
      deleteContents: vi.fn(),
      insertNode: vi.fn(),
      setStartAfter: vi.fn(),
      setEndAfter: vi.fn(),
    })),
    removeAllRanges: vi.fn(),
    addRange: vi.fn(),
  })),
});

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('QuickFormatting', () => {
  const mockOnInsert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnInsert.mockClear();
  });

  it('renders quick formatting trigger button', () => {
    render(<QuickFormatting onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open quick formatting tools/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it('opens dialog when trigger button is clicked', async () => {
    render(<QuickFormatting onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open quick formatting tools/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Quick Formatting')).toBeInTheDocument();
    });
  });

  it('displays formatting categories', async () => {
    render(<QuickFormatting onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open quick formatting tools/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Text Formatting' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Headings' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Lists' })).toBeInTheDocument();
    });
  });

  it('filters actions by category', async () => {
    render(<QuickFormatting onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open quick formatting tools/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const textFormattingButton = screen.getByRole('button', { name: 'Text Formatting' });
      fireEvent.click(textFormattingButton);
      
      // Should show text formatting actions
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('Italic')).toBeInTheDocument();
    });
  });

  it('displays formatting actions with descriptions', async () => {
    render(<QuickFormatting onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open quick formatting tools/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('Make text bold')).toBeInTheDocument();
      expect(screen.getByText('Italic')).toBeInTheDocument();
      expect(screen.getByText('Make text italic')).toBeInTheDocument();
    });
  });

  it('shows keyboard shortcuts for actions', async () => {
    render(<QuickFormatting onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open quick formatting tools/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      // Look for Ctrl and B shortcuts for bold
      expect(screen.getByText('Ctrl')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });

  it('applies formatting when action button is clicked', async () => {
    render(<QuickFormatting onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open quick formatting tools/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const applyButtons = screen.getAllByText('Apply');
      fireEvent.click(applyButtons[0]); // Click first apply button
    });
    
    expect(mockOnInsert).toHaveBeenCalled();
  });

  it('displays helpful tip at the bottom', async () => {
    render(<QuickFormatting onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open quick formatting tools/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Select text in the editor before clicking an action/)).toBeInTheDocument();
    });
  });

  it('handles different formatting actions correctly', async () => {
    render(<QuickFormatting onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open quick formatting tools/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      // Test bold formatting
      const boldApplyButton = screen.getAllByText('Apply')[0];
      fireEvent.click(boldApplyButton);
      
      expect(mockOnInsert).toHaveBeenCalledWith(expect.stringContaining('**'));
    });
  });

  it('shows all categories when "All" is selected', async () => {
    render(<QuickFormatting onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open quick formatting tools/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const allButton = screen.getByRole('button', { name: 'All' });
      fireEvent.click(allButton);
      
      // Should show actions from multiple categories
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('Heading 1')).toBeInTheDocument();
      expect(screen.getByText('Bullet List')).toBeInTheDocument();
    });
  });
});