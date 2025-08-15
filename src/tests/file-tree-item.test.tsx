import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FileTreeItem } from '../components/sidebar/sortable-item'
import { FileNode } from '../utils/build-tree'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

const mockFileNode: FileNode = {
  name: 'test-file.md',
  path: '/project/test-file.md',
  isDir: false,
  children: []
}

const mockFolderNode: FileNode = {
  name: 'docs',
  path: '/project/docs',
  isDir: true,
  children: []
}

describe('FileTreeItem Component', () => {
  const defaultProps = {
    node: mockFileNode,
    depth: 0,
    selectedPath: null,
    unsavedPaths: [],
    openFolders: {},
    onFileSelected: vi.fn(),
    toggleFolder: vi.fn(),
    startRename: vi.fn(),
    setConfirmingDeletePath: vi.fn(),
    setMovingFilePath: vi.fn(),
    index: 0,
  }

  it('renders file name correctly', () => {
    render(<FileTreeItem {...defaultProps} />)
    
    expect(screen.getByText('test-file.md')).toBeInTheDocument()
  })

  it('calls onFileSelected when file is clicked', () => {
    const onFileSelected = vi.fn()
    render(<FileTreeItem {...defaultProps} onFileSelected={onFileSelected} />)
    
    fireEvent.click(screen.getByText('test-file.md'))
    expect(onFileSelected).toHaveBeenCalledWith('/project/test-file.md')
  })

  it('shows unsaved indicator for unsaved files', () => {
    render(
      <FileTreeItem 
        {...defaultProps} 
        unsavedPaths={['/project/test-file.md']}
      />
    )
    
    expect(screen.getByText('●')).toBeInTheDocument()
  })

  it('renders folder differently from file', () => {
    render(<FileTreeItem {...defaultProps} node={mockFolderNode} />)
    
    expect(screen.getByText('docs')).toBeInTheDocument()
    // Should not show file-specific elements like unsaved indicator
    expect(screen.queryByText('●')).not.toBeInTheDocument()
  })

  it('applies selected styling when file is selected', () => {
    const { container } = render(
      <FileTreeItem 
        {...defaultProps} 
        selectedPath="/project/test-file.md"
      />
    )
    
    const fileElement = container.querySelector('.bg-zinc-800')
    expect(fileElement).toBeInTheDocument()
  })

  it('calls toggleFolder when folder is clicked', () => {
    const toggleFolder = vi.fn()
    render(
      <FileTreeItem 
        {...defaultProps} 
        node={mockFolderNode}
        toggleFolder={toggleFolder}
      />
    )
    
    fireEvent.click(screen.getByText('docs'))
    expect(toggleFolder).toHaveBeenCalledWith('/project/docs')
  })
})