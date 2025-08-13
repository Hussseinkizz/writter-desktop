# Writter Desktop - Development Context

## Project Overview
A Tauri-based desktop markdown editor built with React, TypeScript, Tailwind CSS, and shadcn/ui components. Focus on simplicity, offline-first approach, and technical writer-friendly features.

## Current Architecture

### Tech Stack
- **Frontend**: React 18.3.1, TypeScript, Tailwind CSS 4.1.10
- **Desktop**: Tauri 2.x with Rust backend
- **UI Components**: shadcn/ui with Radix UI primitives
- **Editor**: CodeMirror 6 with markdown support
- **Preview**: react-markdown with GitHub markdown CSS
- **State Management**: React hooks with Tauri plugin-store for persistence
- **Build**: Vite 6.x, TypeScript 5.6.2

### File Structure
```
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── sidebar/     # File management components
│   ├── app-header.tsx
│   ├── app-footer.tsx
│   ├── new-editor.tsx
│   ├── new-preview.tsx
│   └── view-layout.tsx
├── hooks/
│   ├── use-settings.tsx
│   └── use-mobile.ts
├── utils/
│   ├── build-tree.ts
│   ├── file-handlers.ts
│   └── tree-helpers.ts
└── App.tsx
```

### Current Features
- ✅ Markdown editing with CodeMirror
- ✅ Live preview with react-markdown
- ✅ File tree navigation
- ✅ Auto-save functionality
- ✅ Project folder management
- ✅ Settings persistence (partial)
- ✅ Word count tracking
- ✅ Dark theme

### Known Issues (from build analysis)
- Build works but has large chunks (1.2MB main chunk)
- Preview component always visible by default
- No plugin system
- Limited settings panel
- No markdown utilities
- File drag/drop needs to be replaced with context menu

## Development Guidelines

### Code Style Requirements
- **Functions only** - No classes or OOP patterns
- **Functional composition** - Small functions composed into complex logic
- **Max 400 lines per file** - Split large files into modules
- **JSDoc comments** - For clarity and explanation
- **Modular approach** - Separate logic from UI components via props

### Dependencies to Add
- `framer-motion` - For subtle animations
- `vitest` - For testing
- Additional dependencies as needed per phase

### Testing Strategy
- Use vitest for unit tests
- Test new features without breaking existing functionality
- Focus on critical paths and user interactions

## Implementation Phases

### Phase 1: Foundation & Core Fixes ✅ COMPLETED
- [x] Fix build issues and setup
- [x] Create context.md and task tracking
- [x] Add vitest testing setup
- [x] Fix preview component (invisible by default)
- [x] Add thin dark scrollbars
- [x] Add framer-motion for animations

### Phase 2: File Management Improvements ✅ COMPLETED
- [x] Remove drag/drop functionality 
- [x] Add context menu with move option
- [x] Auto-append .md extensions to new files
- [x] Auto-open newly created files
- [ ] OS integration for "open with" markdown files

### Phase 3: Plugin System 🔄 IN PROGRESS
- [ ] Design plugin architecture
- [ ] Implement content transformation hooks
- [ ] Add plugin registration system
- [ ] Create example plugins

### Phase 4: Settings & Persistence  
- [ ] Comprehensive settings panel
- [ ] Persist all user preferences
- [ ] Theme customization options

### Phase 5: Markdown Utilities
- [ ] Markdown cheat sheet component
- [ ] Snippet system for common patterns
- [ ] Table creation utility
- [ ] Quick formatting shortcuts

### Phase 6: Enhanced Features
- [ ] Background music player (nature/lofi)
- [ ] Simple todo manager (todo/done/pending)
- [ ] Advanced animations and transitions

## Notes
- All toast notifications use sonner (already installed)
- UI components must use shadcn/ui
- Keep the "notepad-style" simplicity - avoid over-engineering
- Focus on technical writers' workflow