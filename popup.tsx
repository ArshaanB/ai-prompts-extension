'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  File,
  Folder,
  FolderOpen,
  Import
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

// Interface for the File System Access API
interface FileSystemFileHandle {
  getFile(): Promise<File>;
  name: string;
  kind: 'file';
}

interface FileSystemDirectoryHandle {
  values(): AsyncIterableIterator<
    FileSystemFileHandle | FileSystemDirectoryHandle
  >;
  name: string;
  kind: 'directory';
}

declare global {
  interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
  }
}

const mockData: FileNode[] = [
  {
    id: '1',
    name: 'Writing Prompts',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'Creative Writing',
        type: 'folder',
        children: [
          {
            id: '3',
            name: 'story-starter.txt',
            type: 'file',
            content:
              'Write a compelling opening paragraph for a mystery novel set in...'
          },
          {
            id: '4',
            name: 'character-development.txt',
            type: 'file',
            content:
              'Create a detailed character profile including background, motivations...'
          }
        ]
      },
      {
        id: '5',
        name: 'blog-post-ideas.txt',
        type: 'file',
        content:
          'Generate 10 engaging blog post ideas for a tech startup focusing on...'
      }
    ]
  },
  {
    id: '6',
    name: 'Code Prompts',
    type: 'folder',
    children: [
      {
        id: '7',
        name: 'react-component.txt',
        type: 'file',
        content:
          'Create a reusable React component that handles form validation...'
      },
      {
        id: '8',
        name: 'api-documentation.txt',
        type: 'file',
        content:
          'Write comprehensive API documentation for the following endpoints...'
      }
    ]
  },
  {
    id: '9',
    name: 'Business',
    type: 'folder',
    children: [
      {
        id: '10',
        name: 'Marketing',
        type: 'folder',
        children: [
          {
            id: '11',
            name: 'social-media-strategy.txt',
            type: 'file',
            content:
              'Develop a comprehensive social media strategy for a B2B SaaS company...'
          }
        ]
      },
      {
        id: '12',
        name: 'email-templates.txt',
        type: 'file',
        content:
          'Create professional email templates for customer onboarding...'
      }
    ]
  }
];

interface TreeNodeProps {
  node: FileNode;
  level: number;
  onCopy: (content: string) => void;
  onView: (content: string) => void;
}

function TreeNode({ node, level, onCopy, onView }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.content) {
      onCopy(node.content);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.content) {
      onView(node.content);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded cursor-pointer group`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {node.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )}
            <span className="text-sm font-medium flex-1">{node.name}</span>
          </>
        ) : (
          <>
            <div className="w-4" />
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm flex-1">{node.name}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleView}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onCopy={onCopy}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Component() {
  const [view, setView] = useState<'import' | 'library'>('import');
  const [notification, setNotification] = useState<string>('');
  const [importedData, setImportedData] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate unique IDs for nodes
  let nodeIdCounter = 1;

  // Recursive function to process directory and build file tree
  const processDirectory = async (
    directoryHandle: FileSystemDirectoryHandle,
    currentPath: string = ''
  ): Promise<FileNode[]> => {
    const folders: FileNode[] = [];
    const files: FileNode[] = [];

    for await (const entry of directoryHandle.values()) {
      if (entry.kind === 'directory') {
        // Process subdirectory recursively
        const children = await processDirectory(
          entry,
          `${currentPath}/${entry.name}`
        );

        // Only include folders that contain .md files (directly or indirectly)
        const hasMarkdownFiles = (nodes: FileNode[]): boolean => {
          return nodes.some((node) => {
            if (node.type === 'file' && node.name.endsWith('.md')) {
              return true;
            }
            if (node.type === 'folder' && node.children) {
              return hasMarkdownFiles(node.children);
            }
            return false;
          });
        };

        if (hasMarkdownFiles(children)) {
          folders.push({
            id: (nodeIdCounter++).toString(),
            name: entry.name,
            type: 'folder',
            children: children
          });
        }
      } else if (entry.kind === 'file' && entry.name.endsWith('.md')) {
        // Read markdown file content
        try {
          const file = await entry.getFile();
          const content = await file.text();

          files.push({
            id: (nodeIdCounter++).toString(),
            name: entry.name,
            type: 'file',
            content: content
          });
        } catch (error) {
          console.error(`Error reading file ${entry.name}:`, error);
        }
      }
    }

    // Return folders first, then files (for better organization)
    return [...folders, ...files];
  };

  const handleImport = async () => {
    // Check if the File System Access API is supported
    if (!window.showDirectoryPicker) {
      setNotification(
        'File System Access API is not supported in this browser. Please use Chrome 86+ or Edge 86+.'
      );
      setTimeout(() => setNotification(''), 5000);
      return;
    }

    try {
      setIsLoading(true);
      setNotification('Selecting folder...');

      // Open directory picker
      const directoryHandle = await window.showDirectoryPicker();

      setNotification('Reading folder contents...');

      // Process the directory and build the file tree
      const fileTree = await processDirectory(directoryHandle);

      if (fileTree.length === 0) {
        setNotification('No .md files found in the selected folder.');
        setTimeout(() => setNotification(''), 3000);
        setIsLoading(false);
        return;
      }

      // Update state with imported data
      setImportedData(fileTree);
      setView('library');
      setNotification(
        `Successfully imported ${countMarkdownFiles(fileTree)} markdown files.`
      );
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setNotification('Import cancelled.');
      } else {
        console.error('Error importing folder:', error);
        setNotification('Error importing folder. Please try again.');
      }
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to count markdown files in the tree
  const countMarkdownFiles = (nodes: FileNode[]): number => {
    return nodes.reduce((count, node) => {
      if (node.type === 'file') {
        return count + 1;
      } else if (node.type === 'folder' && node.children) {
        return count + countMarkdownFiles(node.children);
      }
      return count;
    }, 0);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setNotification('Copied to clipboard!');
    setTimeout(() => setNotification(''), 2000);
  };

  const handleView = (content: string) => {
    setNotification(`Viewing: ${content.substring(0, 50)}...`);
    setTimeout(() => setNotification(''), 3000);
  };

  // Use imported data if available, otherwise fall back to mock data
  const dataToDisplay = importedData.length > 0 ? importedData : mockData;

  return (
    <div className="w-80 h-96 bg-background flex flex-col">
      <Card className="h-full border-0 rounded-none flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-lg flex items-center gap-2">
            Prompt Library
            {view === 'library' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('import')}
                className="ml-auto"
              >
                <Import className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
          {notification && (
            <div
              className={`text-xs px-2 py-1 rounded ${
                notification.includes('Error') ||
                notification.includes('not supported')
                  ? 'text-red-600 bg-red-50'
                  : 'text-green-600 bg-green-50'
              }`}
            >
              {notification}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0 flex-1 min-h-0">
          {view === 'import' ? (
            <div className="flex items-center justify-center h-full px-6">
              <Button
                onClick={handleImport}
                className="w-full"
                disabled={isLoading}
              >
                <Import className="mr-2 h-4 w-4" />
                {isLoading ? 'Importing...' : 'Import Prompts from Folder'}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full px-3">
              <div className="space-y-1 pb-4">
                {dataToDisplay.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    onCopy={handleCopy}
                    onView={handleView}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
