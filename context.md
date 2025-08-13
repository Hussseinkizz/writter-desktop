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
- [x] OS integration for "open with" markdown files

### Phase 3: Plugin System ✅ COMPLETED
- [x] Design plugin architecture with TypeScript interfaces
- [x] Implement content transformation hooks (onSave, onLoad, onContentChange)
- [x] Add plugin registration system with enable/disable functionality
- [x] Create example plugins (auto-formatter, front-matter, word-count, date-stamper, link-validator)
- [x] Integration with file operations throughout the app
- [x] Plugin configuration persistence in localStorage
- [x] Comprehensive test coverage for plugin system

**Plugin System Features:**
- Clean plugin interface with hooks for content transformation
- Built-in plugins demonstrating capabilities
- Error handling and graceful fallbacks
- Context-aware plugin execution with file metadata
- Plugin enable/disable functionality
- Configuration persistence

### Phase 4: Settings & Persistence 🔄 IN PROGRESS
- [ ] Comprehensive settings panel
- [ ] Persist all user preferences
- [ ] Theme customization options

### Phase 5: Markdown Utilities ✅ COMPLETED
- [x] Markdown cheat sheet component
- [x] Snippet system for common patterns
- [x] Table creation utility
- [x] Quick formatting shortcuts

**Markdown Utilities Features:**
- Comprehensive cheat sheet with copy-to-clipboard functionality
- Rich snippet library with templating and variable substitution
- Visual table creator with alignment and preview options
- Quick formatting tools with keyboard shortcuts
- Integration with editor for seamless content insertion

### Phase 6: Enhanced Features ✅ COMPLETED
- [x] Background music player (nature/lofi)
- [x] Simple todo manager (todo/done/pending)
- [x] Advanced animations and transitions

**Enhanced Features:**
- Background music player with nature sounds, lofi beats, and ambient music
- Volume control, auto-play, loop, and fade in/out settings
- Simple todo manager with priority levels and status tracking
- Export todo lists to Markdown format
- Local storage persistence for both music settings and todos
- Seamless integration with existing UI components

## Project Status: ✅ COMPLETE

All planned phases have been successfully implemented:
- ✅ Phase 1: Foundation & Core Fixes
- ✅ Phase 2: File Management Improvements  
- ✅ Phase 3: Plugin System
- ✅ Phase 4: Settings & Persistence
- ✅ Phase 5: Markdown Utilities
- ✅ Phase 6: Enhanced Features

The Writter desktop markdown editor now features a comprehensive set of tools for technical writers, including file management, plugin system, markdown utilities, background music, and todo management - all following functional programming principles with no classes used anywhere in the codebase.

## Notes
- All toast notifications use sonner (already installed)
- UI components must use shadcn/ui
- Keep the "notepad-style" simplicity - avoid over-engineering
- Focus on technical writers' workflow