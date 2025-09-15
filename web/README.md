# Writter Desktop Landing Page

A dark, responsive landing page for Writter Desktop built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- 🌑 **Dark Theme Only** - Matches Writter's aesthetic with zinc-900 backgrounds and violet accents
- 📱 **Fully Responsive** - Optimized for all screen sizes from mobile to desktop
- 🖥️ **OS Detection** - Automatically detects user's operating system and shows recommended download
- ⬇️ **Download Management** - Direct links to GitHub releases with file size information
- ✨ **Smooth Animations** - Subtle Framer Motion animations throughout
- 🎨 **Violet/Purple Color Scheme** - Consistent with Writter's branding
- 🚀 **SEO Optimized** - Complete meta tags, Open Graph, and Twitter Card support
- ♿ **Accessible** - Built with semantic HTML and accessibility best practices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (customized for dark theme)
- **Icons**: React Icons (Feather & Simple Icons)
- **Animations**: Framer Motion
- **Build Tool**: Turbopack

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with dark theme
│   ├── layout.tsx         # Root layout with SEO metadata
│   └── page.tsx           # Main landing page
├── components/
│   ├── ui/                # shadcn/ui base components
│   │   ├── button.tsx     # Button component
│   │   └── card.tsx       # Card component
│   └── landing/           # Landing page specific components
│       ├── hero-section.tsx      # Hero section with branding
│       ├── download-section.tsx  # OS-specific downloads
│       ├── features-section.tsx  # Feature showcase
│       └── footer.tsx            # Footer component
└── lib/
    ├── utils.ts          # Utility functions (cn, safeTry)
    └── download-utils.ts # OS detection and download logic
```

## Design System

### Colors
- **Background**: zinc-900 (#18181b)
- **Cards**: zinc-800 (#27272a) with transparency
- **Text**: zinc-100 (#f4f4f5) for primary, zinc-400 (#a1a1aa) for secondary
- **Accent**: violet-600 (#7c3aed) for buttons and highlights
- **Borders**: zinc-600 (#52525b)

### Typography
- **Font**: System font stack for optimal performance
- **Headings**: Bold with gradient text effects
- **Body**: Regular weight with good contrast

### Components
- **Large Cards**: Prominent feature sections
- **Large Buttons**: Easy-to-click download actions
- **Subtle Animations**: Fade-ins and hover effects
- **OS Icons**: Platform-specific visual indicators

## Download Logic

The page automatically detects the user's operating system and:
1. Shows the recommended download format prominently
2. Provides alternative formats for each platform
3. Includes file sizes for transparency
4. Links directly to GitHub releases

## Deployment

Build for production:
```bash
npm run build
```

The output is a static site that can be deployed to any hosting platform.

## License

Open source under MIT License, same as Writter Desktop.
