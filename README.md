# Prompt Library Chrome Extension

A lightweight Chrome extension that allows users to import, browse, and copy their personal collection of AI prompts stored locally in `.md` files.

## Technology Stack

- **React** with **TypeScript** for the UI
- **Tailwind CSS** for styling
- **Vite** as the build tool
- Chrome Extension Manifest V3

## Development Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:

   ```bash
   cd ai-prompts-extension
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build the project for production:
   ```bash
   npm run build
   ```

## Loading the Extension in Chrome

1. Build the project:

   ```bash
   npm run build
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right corner)

4. Click "Load unpacked" button

5. Select the `dist` folder from this project

6. The extension should now appear in your Chrome toolbar

## Project Structure

```
ai-prompts-extension/
├── public/
│   ├── manifest.json          # Chrome extension manifest
│   └── icon-*.png            # Extension icons
├── src/
│   ├── App.tsx               # Main React component
│   ├── App.css               # Component styles
│   ├── index.css             # Global styles with Tailwind
│   └── main.tsx              # Entry point
├── dist/                     # Built extension files (generated)
├── package.json
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── postcss.config.js         # PostCSS configuration
```

## Features (Planned)

- Import local folder containing `.md` files
- Browse hierarchical folder structure
- One-click copy of prompts to clipboard
- Preview prompts before copying
- Search and filter functionality

## Current Status

✅ Project scaffolding complete  
✅ React + TypeScript + Tailwind CSS integrated  
✅ Chrome extension manifest configured  
✅ Basic popup interface created  
✅ Build system working

**Next Steps:** Implement folder import and data processing functionality

## Development Notes

- The extension popup has a fixed size (320x384px) optimized for Chrome extensions
- Uses Chrome Extension Manifest V3 for modern compatibility
- Tailwind CSS is configured for production builds with purging enabled
- TypeScript strict mode is enabled for better code quality

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

---

**Handoff Comment for Next Engineer:**

> "The project is fully set up with Vite, React, TS, and Tailwind. You can run `npm run dev` to build the project. The resulting `dist` directory can be loaded as an unpacked extension in Chrome, and the popup correctly renders the basic React component. The foundation is ready for feature development."
