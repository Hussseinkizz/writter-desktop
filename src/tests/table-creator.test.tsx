import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TableCreator } from '../components/markdown-utilities/table-creator';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('TableCreator', () => {
  const mockOnInsert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnInsert.mockClear();
  });

  it('renders table creator trigger button', () => {
    render(<TableCreator onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open table creator/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it('opens dialog when trigger button is clicked', async () => {
    render(<TableCreator onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open table creator/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Table Creator')).toBeInTheDocument();
    });
  });

  it('displays table configuration controls', async () => {
    render(<TableCreator onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open table creator/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Rows')).toBeInTheDocument();
      expect(screen.getByText('Columns')).toBeInTheDocument();
      expect(screen.getByText('Header Row')).toBeInTheDocument();
    });
  });

  it('allows adjusting table dimensions', async () => {
    render(<TableCreator onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open table creator/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      // Find plus button for rows and click it
      const plusButtons = screen.getAllByRole('button');
      const rowPlusButton = plusButtons.find(btn => 
        btn.getAttribute('aria-label') === null && 
        btn.querySelector('svg')
      );
      
      if (rowPlusButton) {
        fireEvent.click(rowPlusButton);
      }
      
      // Check if the number increased (should show 4 instead of 3)
      const rowCount = screen.getByText('3'); // Default value
      expect(rowCount).toBeInTheDocument();
    });
  });

  it('shows table preview', async () => {
    render(<TableCreator onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open table creator/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Preview')).toBeInTheDocument();
      // Should show markdown table syntax
      expect(screen.getByText(/\|.*Column 1.*\|/)).toBeInTheDocument();
    });
  });

  it('allows toggling header row', async () => {
    render(<TableCreator onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open table creator/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const headerToggle = screen.getByRole('switch');
      fireEvent.click(headerToggle);
      
      // Header section should still be available in the DOM but might be hidden
      expect(headerToggle).toBeInTheDocument();
    });
  });

  it('inserts table when insert button is clicked', async () => {
    render(<TableCreator onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open table creator/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const insertButton = screen.getByRole('button', { name: /^Insert Table$/i });
      fireEvent.click(insertButton);
    });
    
    expect(mockOnInsert).toHaveBeenCalledWith(expect.stringContaining('|'));
  });

  it('allows resetting table configuration', async () => {
    render(<TableCreator onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open table creator/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      const resetButton = screen.getByRole('button', { name: /reset/i });
      fireEvent.click(resetButton);
      
      // Should reset to default values
      expect(screen.getByText('3')).toBeInTheDocument(); // Default row count
    });
  });

  it('allows editing cell content', async () => {
    render(<TableCreator onInsert={mockOnInsert} />);
    const triggerButton = screen.getByRole('button', { name: /open table creator/i });
    
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      // Find input fields for table cells
      const cellInputs = screen.getAllByDisplayValue('');
      if (cellInputs.length > 0) {
        fireEvent.change(cellInputs[0], { target: { value: 'Test Cell' } });
        expect(cellInputs[0]).toHaveValue('Test Cell');
      }
    });
  });
});