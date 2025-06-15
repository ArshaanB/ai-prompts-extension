"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronRight, Copy, Eye, File, Folder, FolderOpen, Import } from "lucide-react"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  content?: string
}

const mockData: FileNode[] = [
  {
    id: "1",
    name: "Writing Prompts",
    type: "folder",
    children: [
      {
        id: "2",
        name: "Creative Writing",
        type: "folder",
        children: [
          {
            id: "3",
            name: "story-starter.txt",
            type: "file",
            content: "Write a compelling opening paragraph for a mystery novel set in...",
          },
          {
            id: "4",
            name: "character-development.txt",
            type: "file",
            content: "Create a detailed character profile including background, motivations...",
          },
        ],
      },
      {
        id: "5",
        name: "blog-post-ideas.txt",
        type: "file",
        content: "Generate 10 engaging blog post ideas for a tech startup focusing on...",
      },
    ],
  },
  {
    id: "6",
    name: "Code Prompts",
    type: "folder",
    children: [
      {
        id: "7",
        name: "react-component.txt",
        type: "file",
        content: "Create a reusable React component that handles form validation...",
      },
      {
        id: "8",
        name: "api-documentation.txt",
        type: "file",
        content: "Write comprehensive API documentation for the following endpoints...",
      },
    ],
  },
  {
    id: "9",
    name: "Business",
    type: "folder",
    children: [
      {
        id: "10",
        name: "Marketing",
        type: "folder",
        children: [
          {
            id: "11",
            name: "social-media-strategy.txt",
            type: "file",
            content: "Develop a comprehensive social media strategy for a B2B SaaS company...",
          },
        ],
      },
      {
        id: "12",
        name: "email-templates.txt",
        type: "file",
        content: "Create professional email templates for customer onboarding...",
      },
    ],
  },
]

interface TreeNodeProps {
  node: FileNode
  level: number
  onCopy: (content: string) => void
  onView: (content: string) => void
}

function TreeNode({ node, level, onCopy, onView }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)

  const handleToggle = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded)
    }
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.content) {
      onCopy(node.content)
    }
  }

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.content) {
      onView(node.content)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded cursor-pointer group`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {node.type === "folder" ? (
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
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleView}>
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>
      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} onCopy={onCopy} onView={onView} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Component() {
  const [view, setView] = useState<"import" | "library">("import")
  const [notification, setNotification] = useState<string>("")

  const handleImport = () => {
    setView("library")
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    setNotification("Copied to clipboard!")
    setTimeout(() => setNotification(""), 2000)
  }

  const handleView = (content: string) => {
    setNotification(`Viewing: ${content.substring(0, 50)}...`)
    setTimeout(() => setNotification(""), 3000)
  }

  return (
    <div className="w-80 h-96 bg-background">
      <Card className="h-full border-0 rounded-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            Prompt Library
            {view === "library" && (
              <Button variant="ghost" size="sm" onClick={() => setView("import")} className="ml-auto">
                <Import className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
          {notification && <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">{notification}</div>}
        </CardHeader>
        <CardContent className="p-0 flex-1">
          {view === "import" ? (
            <div className="flex items-center justify-center h-full px-6">
              <Button onClick={handleImport} className="w-full">
                <Import className="mr-2 h-4 w-4" />
                Import Prompts from Folder
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full px-3">
              <div className="space-y-1 pb-4">
                {mockData.map((node) => (
                  <TreeNode key={node.id} node={node} level={0} onCopy={handleCopy} onView={handleView} />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
