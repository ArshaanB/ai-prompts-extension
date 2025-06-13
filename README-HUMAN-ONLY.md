### **Product: "Prompt Library" Chrome Extension**

#### **1. Core Vision**

To create a lightweight, efficient Chrome extension that allows users to import, browse, and copy their personal collection of AI prompts stored locally in `.md` files. The goal is to streamline the user's workflow by providing quick and easy access to their prompts directly within the browser.

#### **2. Key Features**

- **Local Folder Import:**

  - The user will be able to select a single folder from their local file system.
  - The extension will recursively scan the selected folder, including all sub-folders to any depth, to find prompt files.
  - Only files with a `.md` extension will be recognized as prompts.

- **Hierarchical Prompt Navigation:**

  - The extension's interface will replicate the user's folder structure.
  - Users can navigate this tree of folders and files to find the desired prompt.

- **Interaction Model:**

  - **One-Click Copy:** Clicking directly on a prompt's filename will immediately copy the entire content of that `.md` file to the user's clipboard.
  - **Prompt Preview:** A distinct button or icon will be available next to each filename. Clicking this will display the full content of the prompt for viewing, without copying it.

- **Data Handling:**
  - **One-Time Read:** The extension will read the entire prompt library at the moment the user selects the folder. It will store the file structure and prompt contents within its own storage.
  - **No Persistent File Access:** The extension will **not** maintain a live link to the local file system. It does not need ongoing permissions to read the folder.
  - **Manual Refresh:** To update the prompt library (e.g., after adding or editing prompts locally), the user will need to re-trigger the folder selection process within the extension.

#### **3. User Experience Flow**

1.  **Onboarding:** On first launch, the user is presented with a button to "Load Prompt Library".
2.  **Import:** The user clicks the button, which opens a native folder-picker dialog. They select their root prompt folder.
3.  **Processing:** The extension reads the folder structure and `.md` file contents, saving them to its internal storage. A confirmation message indicates the import is complete.
4.  **Usage:** The user clicks the extension icon in the Chrome toolbar. A popup appears, displaying the root of their prompt hierarchy. They can browse folders, preview prompts, and click to copy.

---

Here is a breakdown of the project into a sequence of actionable tasks.

The technology stack we'll use is **React with TypeScript**, **Tailwind CSS** for styling, and **Vite** as our build tool. This modern stack is perfect for creating a fast, maintainable, and good-looking Chrome extension.

Here are the tasks, designed to be picked up sequentially by a senior engineer.

---

### **Task 1: Project Scaffolding and Basic Extension Setup**

- **Goal:** Create the foundational structure for our Chrome extension. The deliverable is a loadable "empty" extension that demonstrates the core technologies are integrated correctly.
- **Context for the Engineer:** This is the first task. Your goal is to set up a clean, modern development environment. There is no prior codebase. The result of this task will be the skeleton upon which all future features are built.
- **Task Details:**
  1.  Initialize a new project using Vite with its `React + TypeScript` template.
  2.  Set up the `manifest.json` file. This is the heart of the Chrome extension. Define the extension's name, version, description, and the `action` property to specify `popup.html` as the main interface.
  3.  Integrate Tailwind CSS into the Vite project. Ensure it's correctly configured to purge unused styles for a production build.
  4.  Create a basic `App` component that renders a simple message like "Prompt Library Extension".
  5.  Provide a short `README.md` note in the project with clear, simple instructions on how to run the project in development mode and how to load the `dist` folder as an unpacked extension in Chrome's `chrome://extensions` page.
- **Handoff Comment for Next Engineer:**
  > "The project is fully set up with Vite, React, TS, and Tailwind. You can run `npm run dev` to build the project. The resulting `dist` directory can be loaded as an unpacked extension in Chrome, and the popup correctly renders the basic React component. The foundation is ready for feature development."

### **Task 2: Implement Folder Import and Data Processing**

- **Goal:** Implement the core feature of selecting a local folder and recursively reading its contents. The deliverable is a functional "Import" button that processes the selected directory and logs the resulting data structure.
- **Context for the Engineer:** The project skeleton is ready. You will now build the data ingestion pipeline. You need to use the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) (`window.showDirectoryPicker()`) as it's the only modern web standard for selecting entire directories.
- **Task Details:**
  1.  In the main `App` component, add a "Load Prompts" button.
  2.  Create a service or utility function that, when called, invokes `window.showDirectoryPicker()`.
  3.  Write a recursive async function that accepts a `FileSystemDirectoryHandle`. This function should iterate through the directory entries.
  4.  If an entry is a file and ends with `.md`, read its content as text.
  5.  If an entry is a directory, recursively call the function on it.
  6.  Assemble the results into a structured JSON object that mirrors the folder hierarchy (e.g., `{ name: 'folder', children: [{ name: 'file.md', content: '...' }] }`).
  7.  For this task, simply `console.log` the final JSON object to verify the logic is working correctly. Error handling for API availability or user cancellation should be considered.
- **Handoff Comment for Next Engineer:**
  > "The folder import logic is complete. Clicking the 'Load Prompts' button now opens a directory picker. Upon selection, the entire folder structure is recursively scanned for `.md` files, and a JSON representation of the hierarchy and file contents is logged to the console. The next step is to store this data and render it."

### **Task 3: Data Persistence and Hierarchical UI Rendering**

- **Goal:** Take the data structure from the previous task, save it to the extension's local storage, and render the folder/file hierarchy in the UI.
- **Context for the Engineer:** We can now get the prompt data. The next step is to make it persistent across browser sessions and display it to the user. You'll use `chrome.storage.local` for persistence, which is the standard for extensions.
- **Task Details:**
  1.  Modify the import logic from Task 2. Instead of logging the JSON object, save it to `chrome.storage.local.set()`.
  2.  When the extension popup loads, it should first attempt to read data from `chrome.storage.local.get()`.
  3.  If data exists, render the hierarchy. If not, show the "Load Prompts" button from Task 2.
  4.  Create a recursive React component (e.g., `TreeNode`) that can render either a folder or a file.
  5.  A folder should display its name and be clickable to expand/collapse its children. Use state to manage the expanded/collapsed state of each folder.
  6.  A file should just display its name for now. The UI should be a clean, nested list.
- **Handoff Comment for Next Engineer:**
  > "Data persistence is implemented. The imported prompt library is now saved in `chrome.storage.local` and is loaded automatically when the popup opens. The UI correctly renders the nested folder and file structure with collapsible folders. The core view is ready for user interaction."

### **Task 4: Implement Core User Actions (Copy & Preview)**

- **Goal:** Make the rendered file list interactive by implementing the one-click copy and prompt preview functionality.
- **Context for the Engineer:** The UI now displays the file structure. This task focuses on implementing the two primary user actions as defined in the PRD. You'll need the `navigator.clipboard` API for copying.
- **Task Details:**
  1.  Make the file name element in your `TreeNode` component a `button`.
  2.  When a user clicks this file button, retrieve its content from your data structure and use `navigator.clipboard.writeText()` to copy it to the clipboard.
  3.  Implement visual feedback for the copy action (e.g., a temporary "Copied!" message).
  4.  Add a small "Preview" icon/button next to each file name.
  5.  When the Preview button is clicked, display the prompt's content in a modal window or an inline, expandable area. This allows the user to read a prompt without committing it to their clipboard.
- **Handoff Comment for Next Engineer:**
  > "The extension is now fully interactive. Clicking a file name copies its content to the clipboard, and a 'Preview' button allows for viewing the content in a modal. The core functionality is complete. The final step is to polish the UX."

### **Task 5: UI/UX Polish and Refinements**

- **Goal:** Improve the overall user experience with search functionality, a reset option, and general styling enhancements.
- **Context for the Engineer:** The extension is functional but can be made more powerful and user-friendly. This task is about adding the final layer of polish that makes a good tool great.
- **Task Details:**
  1.  Add a text input at the top of the popup to serve as a search/filter bar.
  2.  As the user types into the search bar, filter the displayed tree in real-time to only show files/folders whose names match the query.
  3.  Add a "Reload" or "Clear Data" button somewhere in the UI. This button should clear the data from `chrome.storage.local` and return the UI to the initial "Load Prompts" state.
  4.  Conduct a final pass on the UI using Tailwind CSS. Ensure consistent spacing, clean typography, intuitive hover/active states for all interactive elements, and a professional look.
  5.  Add a simple loading indicator that shows while the initial file processing is happening to handle large prompt libraries gracefully.
- **Handoff Comment for Next Engineer:**
  > "The extension is now feature-complete. It includes search/filtering, a data reset mechanism, and a polished, professional UI. All core requirements from the PRD have been met. The project is ready for final testing and packaging for release."
