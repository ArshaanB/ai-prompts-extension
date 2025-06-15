# AI Prompts Extension v0

This document summarizes the current state of the AI Prompts Extension project.

## Accomplishments (v0)

This initial version of the extension was built to provide a foundational interface for managing and using AI prompts.

### Core Technologies

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **UI Components**: `shadcn/ui` (Button, Card, ScrollArea)
- **Icons**: `lucide-react`

### Features Implemented

- **Popup UI**: A functional popup interface has been created in `popup.tsx`. This serves as the main view for the extension.
- **Prompt Library View**: The UI can display a hierarchical (tree-based) view of prompt folders and files.
  - Folders can be expanded and collapsed to navigate the prompt library.
  - The file and folder structure is currently populated by mock data in `popup.tsx`.
- **Copy Functionality**: Users can copy the content of a prompt file directly to their clipboard from the UI. A notification confirms the action.
- **View Functionality (Placeholder)**: A "view" button is present for each prompt. It currently shows a notification, but the full implementation of a detailed prompt view is pending.
- **Two-View System**: The popup has two states:
  1.  An initial "import" view with a button to load prompts.
  2.  A "library" view that displays the prompts after the import button is clicked (currently loads mock data).

### Architecture Notes

- The main component is `popup.tsx`, which is intended to be used as the browser extension's popup.
- UI components from `shadcn/ui` are located in `components/ui`.
- The project is set up with standard Next.js and TypeScript configurations.

The current implementation provides a solid base for future development, which will involve replacing the mock data with a real data source from imported user files.
