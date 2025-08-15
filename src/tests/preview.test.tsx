import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Preview } from '../components/new-preview'

describe('Preview Component', () => {
  it('renders markdown content correctly', () => {
    const markdown = '# Hello World\n\nThis is a **test** markdown.'
    
    render(<Preview markdown={markdown} />)
    
    // Check if the content is rendered (checking for heading)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello World')
  })

  it('applies proper styling classes', () => {
    const markdown = '# Test'
    
    const { container } = render(<Preview markdown={markdown} />)
    
    // Check if the main container has the expected classes
    const previewContainer = container.firstChild
    expect(previewContainer).toHaveClass('h-[90vh]', 'w-full', 'overflow-y-auto', 'bg-background')
  })

  it('renders empty content without errors', () => {
    const { container } = render(<Preview markdown="" />)
    
    // Should render without throwing errors
    expect(container.firstChild).toBeInTheDocument()
  })
})