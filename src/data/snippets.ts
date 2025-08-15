/**
 * Snippet data structure
 */
export interface MarkdownSnippet {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  variables?: string[];
}

/**
 * Default markdown snippets collection
 */
export const defaultSnippets: MarkdownSnippet[] = [
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