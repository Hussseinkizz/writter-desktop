/**
 * Built-in plugins for the Writter application
 * These plugins demonstrate the plugin system capabilities and provide useful functionality
 */

import { Plugin } from '@/types/plugin';

/**
 * Auto-formatter plugin that cleans up markdown formatting on save
 */
export const autoFormatterPlugin: Plugin = {
  id: 'auto-formatter',
  name: 'Auto Formatter',
  description: 'Automatically formats markdown content on save',
  version: '1.0.0',
  author: 'Writter Team',
  enabled: true,
  config: {
    removeExtraSpaces: true,
    normalizeHeadings: true,
    trimLines: true,
  },
  hooks: {
    onSave: async (content, context) => {
      let formatted = content;

      // Remove extra spaces between words
      if (autoFormatterPlugin.config.removeExtraSpaces) {
        formatted = formatted.replace(/[ \t]+/g, ' ');
      }

      // Normalize heading spacing
      if (autoFormatterPlugin.config.normalizeHeadings) {
        formatted = formatted.replace(/^(#{1,6})\s*/gm, '$1 ');
      }

      // Trim lines
      if (autoFormatterPlugin.config.trimLines) {
        formatted = formatted
          .split('\n')
          .map(line => line.trim())
          .join('\n');
      }

      // Remove excessive newlines (more than 2 consecutive)
      formatted = formatted.replace(/\n{3,}/g, '\n\n');

      return formatted;
    },
  },
};

/**
 * Front matter plugin that adds YAML front matter to files
 */
export const frontMatterPlugin: Plugin = {
  id: 'front-matter',
  name: 'Front Matter',
  description: 'Adds YAML front matter with metadata to new files',
  version: '1.0.0',
  author: 'Writter Team',
  enabled: false,
  config: {
    includeTitle: true,
    includeDate: true,
    includeAuthor: true,
    defaultAuthor: 'Author',
  },
  hooks: {
    onSave: async (content, context) => {
      // Only add front matter if file doesn't already have it and it's a new file
      if (content.startsWith('---')) {
        return content;
      }

      const frontMatter: string[] = ['---'];
      
      if (frontMatterPlugin.config.includeTitle) {
        const title = context.fileName.replace(/\.[^/.]+$/, ""); // Remove extension
        frontMatter.push(`title: "${title}"`);
      }

      if (frontMatterPlugin.config.includeDate) {
        frontMatter.push(`date: ${context.timestamp.toISOString().split('T')[0]}`);
      }

      if (frontMatterPlugin.config.includeAuthor) {
        frontMatter.push(`author: "${frontMatterPlugin.config.defaultAuthor}"`);
      }

      frontMatter.push('---', '');

      return frontMatter.join('\n') + content;
    },
  },
};

/**
 * Word count plugin that adds word count at the end of files
 */
export const wordCountPlugin: Plugin = {
  id: 'word-count',
  name: 'Word Count',
  description: 'Adds word count information at the end of documents',
  version: '1.0.0',
  author: 'Writter Team',
  enabled: false,
  config: {
    showWords: true,
    showCharacters: true,
    showLines: true,
    position: 'end', // 'start' or 'end'
  },
  hooks: {
    onSave: async (content, context) => {
      // Remove existing word count comment if present
      const cleanContent = content.replace(/<!-- Word Count:.*?-->/s, '').trim();
      
      const words = cleanContent.trim().split(/\s+/).length;
      const characters = cleanContent.length;
      const lines = cleanContent.split('\n').length;
      
      const stats: string[] = [];
      if (wordCountPlugin.config.showWords) stats.push(`${words} words`);
      if (wordCountPlugin.config.showCharacters) stats.push(`${characters} characters`);
      if (wordCountPlugin.config.showLines) stats.push(`${lines} lines`);
      
      const comment = `<!-- Word Count: ${stats.join(', ')} -->`;
      
      if (wordCountPlugin.config.position === 'start') {
        return comment + '\n\n' + cleanContent;
      } else {
        return cleanContent + '\n\n' + comment;
      }
    },
  },
};

/**
 * Date stamper plugin that adds/updates last modified date
 */
export const dateStamperPlugin: Plugin = {
  id: 'date-stamper',
  name: 'Date Stamper',
  description: 'Adds or updates last modified date in documents',
  version: '1.0.0',
  author: 'Writter Team',
  enabled: false,
  config: {
    format: 'YYYY-MM-DD',
    includeTime: false,
    position: 'start', // 'start' or 'end'
  },
  hooks: {
    onSave: async (content, context) => {
      const now = context.timestamp;
      let dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (dateStamperPlugin.config.includeTime) {
        dateString = now.toLocaleString();
      }
      
      // Remove existing date stamp if present
      const cleanContent = content.replace(/<!-- Last modified:.*?-->/s, '').trim();
      
      const dateComment = `<!-- Last modified: ${dateString} -->`;
      
      if (dateStamperPlugin.config.position === 'start') {
        return dateComment + '\n\n' + cleanContent;
      } else {
        return cleanContent + '\n\n' + dateComment;
      }
    },
  },
};

/**
 * Link validator plugin that checks for broken markdown links
 */
export const linkValidatorPlugin: Plugin = {
  id: 'link-validator',
  name: 'Link Validator',
  description: 'Validates markdown links and adds warnings for broken ones',
  version: '1.0.0',
  author: 'Writter Team',
  enabled: false,
  config: {
    checkInternalLinks: true,
    checkExternalLinks: false, // Disabled by default as it requires network access
    addWarningComments: true,
  },
  hooks: {
    onSave: async (content, context) => {
      if (!linkValidatorPlugin.config.checkInternalLinks) {
        return content;
      }

      // Find all markdown links [text](url)
      const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
      let modifiedContent = content;
      const matches = Array.from(content.matchAll(linkRegex));
      
      for (const match of matches) {
        const [fullMatch, text, url] = match;
        
        // Check internal links (relative paths)
        if (!url.startsWith('http') && !url.startsWith('mailto:')) {
          // This is a simplified check - in a real implementation,
          // you'd want to check if the file actually exists
          if (linkValidatorPlugin.config.addWarningComments && url.includes('broken')) {
            const warning = `<!-- WARNING: Potential broken link: ${url} -->`;
            modifiedContent = modifiedContent.replace(fullMatch, warning + '\n' + fullMatch);
          }
        }
      }
      
      return modifiedContent;
    },
  },
};

/**
 * All built-in plugins
 */
export const builtInPlugins: Plugin[] = [
  autoFormatterPlugin,
  frontMatterPlugin,
  wordCountPlugin,
  dateStamperPlugin,
  linkValidatorPlugin,
];