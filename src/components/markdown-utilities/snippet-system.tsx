import { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { HiTemplate, HiSearch, HiPlus } from 'react-icons/hi';
import { toast } from 'sonner';

/**
 * Snippet data structure
 */
interface MarkdownSnippet {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  variables?: string[];
}

/**
 * Create default markdown snippets
 */
const createDefaultSnippets = (): MarkdownSnippet[] => {
  return [
    {
      id: 'frontmatter-blog',
      name: 'Blog Post Front Matter',
      description: 'Front matter for blog posts',
      category: 'Front Matter',
      template: `---
title: "{{title}}"
date: {{date}}
author: "{{author}}"
tags: [{{tags}}]
draft: false
---

# {{title}}

{{content}}`,
      variables: ['title', 'date', 'author', 'tags', 'content']
    },
    {
      id: 'frontmatter-docs',
      name: 'Documentation Front Matter',
      description: 'Front matter for documentation',
      category: 'Front Matter',
      template: `---
title: "{{title}}"
description: "{{description}}"
sidebar_position: {{position}}
---

# {{title}}

{{description}}

## Overview

{{content}}`,
      variables: ['title', 'description', 'position', 'content']
    },
    {
      id: 'table-simple',
      name: 'Simple Table',
      description: 'Basic 3x3 table',
      category: 'Tables',
      template: `| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| {{cell1}} | {{cell2}} | {{cell3}} |
| {{cell4}} | {{cell5}} | {{cell6}} |
| {{cell7}} | {{cell8}} | {{cell9}} |`,
      variables: ['cell1', 'cell2', 'cell3', 'cell4', 'cell5', 'cell6', 'cell7', 'cell8', 'cell9']
    },
    {
      id: 'code-block',
      name: 'Code Block with Description',
      description: 'Code block with explanation',
      category: 'Code',
      template: `## {{title}}

{{description}}

\`\`\`{{language}}
{{code}}
\`\`\`

**Explanation:**
{{explanation}}`,
      variables: ['title', 'description', 'language', 'code', 'explanation']
    },
    {
      id: 'meeting-notes',
      name: 'Meeting Notes',
      description: 'Template for meeting notes',
      category: 'Templates',
      template: `# Meeting Notes - {{date}}

## Attendees
- {{attendee1}}
- {{attendee2}}

## Agenda
1. {{agenda1}}
2. {{agenda2}}
3. {{agenda3}}

## Discussion

### {{topic1}}
{{discussion1}}

### {{topic2}}
{{discussion2}}

## Action Items
- [ ] {{action1}} - {{assignee1}}
- [ ] {{action2}} - {{assignee2}}

## Next Meeting
- **Date:** {{next_date}}
- **Topics:** {{next_topics}}`,
      variables: ['date', 'attendee1', 'attendee2', 'agenda1', 'agenda2', 'agenda3', 'topic1', 'discussion1', 'topic2', 'discussion2', 'action1', 'assignee1', 'action2', 'assignee2', 'next_date', 'next_topics']
    },
    {
      id: 'project-readme',
      name: 'Project README',
      description: 'Complete README template',
      category: 'Templates',
      template: `# {{project_name}}

{{description}}

## Features

- {{feature1}}
- {{feature2}}
- {{feature3}}

## Installation

\`\`\`bash
{{install_command}}
\`\`\`

## Usage

\`\`\`{{language}}
{{usage_example}}
\`\`\`

## Contributing

{{contributing_info}}

## License

{{license}}`,
      variables: ['project_name', 'description', 'feature1', 'feature2', 'feature3', 'install_command', 'language', 'usage_example', 'contributing_info', 'license']
    },
    {
      id: 'task-list',
      name: 'Task List',
      description: 'Organized task list template',
      category: 'Lists',
      template: `# {{title}} - Tasks

## High Priority
- [ ] {{high1}}
- [ ] {{high2}}
- [ ] {{high3}}

## Medium Priority
- [ ] {{medium1}}
- [ ] {{medium2}}

## Low Priority
- [ ] {{low1}}
- [ ] {{low2}}

## Completed ✅
- [x] {{completed1}}
- [x] {{completed2}}

---
*Last updated: {{date}}*`,
      variables: ['title', 'high1', 'high2', 'high3', 'medium1', 'medium2', 'low1', 'low2', 'completed1', 'completed2', 'date']
    }
  ];
};

/**
 * Process snippet template with variables
 */
const processSnippetTemplate = (template: string, variables?: string[]): string => {
  if (!variables || variables.length === 0) {
    return template;
  }

  let processed = template;
  variables.forEach(variable => {
    const placeholder = `{{${variable}}}`;
    const userValue = prompt(`Enter value for "${variable}":`);
    if (userValue !== null) {
      processed = processed.replace(new RegExp(placeholder, 'g'), userValue);
    }
  });

  return processed;
};

/**
 * Individual snippet item component
 */
const SnippetItem = ({ 
  snippet, 
  onInsert 
}: { 
  snippet: MarkdownSnippet; 
  onInsert: (content: string) => void;
}) => {
  const handleInsert = () => {
    const processedContent = processSnippetTemplate(snippet.template, snippet.variables);
    onInsert(processedContent);
    toast.success(`Inserted snippet: ${snippet.name}`);
  };

  return (
    <div className="p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-neutral-200">{snippet.name}</h4>
            <Badge variant="outline" className="text-xs">
              {snippet.category}
            </Badge>
          </div>
          <p className="text-sm text-neutral-400 mb-3">{snippet.description}</p>
          {snippet.variables && snippet.variables.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-neutral-500 mb-1">Variables:</p>
              <div className="flex flex-wrap gap-1">
                {snippet.variables.map((variable) => (
                  <Badge key={variable} variant="secondary" className="text-xs">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleInsert}
          className="ml-2 bg-violet-600 hover:bg-violet-700"
        >
          <HiPlus className="h-4 w-4 mr-1" />
          Insert
        </Button>
      </div>
      <details className="mt-2">
        <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-400">
          Preview Template
        </summary>
        <pre className="text-xs text-neutral-400 bg-neutral-900 p-2 rounded mt-2 overflow-x-auto">
          {snippet.template.slice(0, 200)}
          {snippet.template.length > 200 && '...'}
        </pre>
      </details>
    </div>
  );
};

/**
 * Snippet system component props
 */
interface SnippetSystemProps {
  onInsert: (content: string) => void;
}

/**
 * Markdown snippet system dialog component
 */
export const SnippetSystem = ({ onInsert }: SnippetSystemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const snippets = createDefaultSnippets();
  const categories = ['All', ...Array.from(new Set(snippets.map(s => s.category)))];

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || snippet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInsertAndClose = (content: string) => {
    onInsert(content);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-neutral-300 hover:bg-zinc-800 transition"
          title="Insert Snippet"
          aria-label="Open snippet library"
        >
          <HiTemplate className="text-xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-xl font-semibold">
            Snippet Library
          </DialogTitle>
        </DialogHeader>
        
        {/* Search and Filters */}
        <div className="flex gap-4 items-center mb-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-200"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-200 text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {filteredSnippets.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <HiTemplate className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No snippets found matching your criteria.</p>
              </div>
            ) : (
              filteredSnippets.map((snippet) => (
                <SnippetItem
                  key={snippet.id}
                  snippet={snippet}
                  onInsert={handleInsertAndClose}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};