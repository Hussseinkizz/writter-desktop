import { MarkdownSnippet } from '../data/snippets';

const CUSTOM_SNIPPETS_KEY = 'writter-custom-snippets';

/**
 * Custom snippets manager for localStorage operations
 */
export class CustomSnippetsManager {
  /**
   * Get all custom snippets from localStorage
   */
  static getCustomSnippets(): MarkdownSnippet[] {
    try {
      const stored = localStorage.getItem(CUSTOM_SNIPPETS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load custom snippets:', error);
      return [];
    }
  }

  /**
   * Save a new custom snippet
   */
  static saveCustomSnippet(snippet: Omit<MarkdownSnippet, 'id'>): MarkdownSnippet {
    const customSnippets = this.getCustomSnippets();
    const newSnippet: MarkdownSnippet = {
      ...snippet,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    };
    
    customSnippets.push(newSnippet);
    this.saveCustomSnippets(customSnippets);
    return newSnippet;
  }

  /**
   * Update an existing custom snippet
   */
  static updateCustomSnippet(id: string, updates: Partial<Omit<MarkdownSnippet, 'id'>>): boolean {
    const customSnippets = this.getCustomSnippets();
    const index = customSnippets.findIndex(s => s.id === id);
    
    if (index === -1) return false;
    
    customSnippets[index] = { ...customSnippets[index], ...updates };
    this.saveCustomSnippets(customSnippets);
    return true;
  }

  /**
   * Delete a custom snippet
   */
  static deleteCustomSnippet(id: string): boolean {
    const customSnippets = this.getCustomSnippets();
    const filtered = customSnippets.filter(s => s.id !== id);
    
    if (filtered.length === customSnippets.length) return false;
    
    this.saveCustomSnippets(filtered);
    return true;
  }

  /**
   * Save custom snippets array to localStorage
   */
  private static saveCustomSnippets(snippets: MarkdownSnippet[]): void {
    try {
      localStorage.setItem(CUSTOM_SNIPPETS_KEY, JSON.stringify(snippets));
    } catch (error) {
      console.error('Failed to save custom snippets:', error);
    }
  }

  /**
   * Check if a snippet is custom (user-created)
   */
  static isCustomSnippet(id: string): boolean {
    return id.startsWith('custom-');
  }
}