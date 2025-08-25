"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Monitor, Apple } from "lucide-react"
import type { AppShortcuts } from "@/lib/shortcuts-database"

interface ToolDetailPageProps {
  tool: AppShortcuts
  onBack: () => void
}

export function ToolDetailPage({ tool, onBack }: ToolDetailPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<"mac" | "windows">("mac")

  const getAppLogo = (appName: string) => {
    const logoMap: Record<string, string> = {
      Chrome: "/chrome-browser-logo.png",
      Safari: "/safari-browser-logo.png",
      Firefox: "/firefox-browser-logo.png",
      macOS: "/apple-macos-logo.png",
      Windows: "/windows-os-logo.png",
      Linux: "/linux-penguin-logo.png",
      "VS Code": "/visual-studio-code-logo.png",
      Linear: "/linear-app-logo.png",
      Jira: "/atlassian-jira-logo.png",
      Notion: "/notion-app-logo.png",
      ChatGPT: "/openai-chatgpt-logo.png",
      Slack: "/slack-communication-logo.png",
      Figma: "/figma-design-tool-logo.png",
      GitHub: "/github-octocat-logo.png",
      Gmail: "/gmail-google-logo.png",
      Excel: "/microsoft-excel-logo.png",
      "Google Sheets": "/google-sheets-logo.png",
      Intercom: "/intercom-support-logo.png",
    }
    return logoMap[appName] || "/placeholder.svg?height=48&width=48"
  }

  const getAppDescription = (appName: string) => {
    const descriptions: Record<string, string> = {
      Chrome: "Google's web browser with extensive keyboard shortcuts for navigation, tabs, and developer tools",
      Safari: "Apple's web browser for Mac and iOS with optimized keyboard shortcuts",
      Firefox: "Mozilla's open-source web browser with comprehensive keyboard navigation",
      macOS: "Apple's desktop operating system with system-wide keyboard shortcuts",
      Windows: "Microsoft Windows operating system with built-in keyboard shortcuts",
      Linux: "Linux desktop environment shortcuts for efficient system navigation",
      "VS Code": "Microsoft's powerful code editor with extensive keyboard shortcuts for development",
      Linear: "Modern issue tracking tool designed with keyboard-first navigation",
      Jira: "Atlassian's project management and issue tracking with keyboard shortcuts",
      Notion: "All-in-one workspace with keyboard shortcuts for notes and collaboration",
      ChatGPT: "OpenAI's conversational AI assistant with keyboard shortcuts",
      Slack: "Team communication platform with keyboard shortcuts for efficiency",
      Figma: "Collaborative design and prototyping tool with design-focused shortcuts",
      GitHub: "Git repository hosting with keyboard shortcuts for code collaboration",
      Gmail: "Google's email service with comprehensive keyboard shortcuts",
      Excel: "Microsoft's spreadsheet application with extensive keyboard shortcuts",
      "Google Sheets": "Google's cloud-based spreadsheet with keyboard navigation",
      Intercom: "Customer support and messaging platform with keyboard shortcuts",
    }
    return descriptions[appName] || "Comprehensive keyboard shortcuts for this application"
  }

  const convertShortcutToPlatform = (keys: string, platform: "mac" | "windows") => {
    if (platform === "windows") {
      return keys
        .replace(/⌘/g, "Ctrl")
        .replace(/Cmd/g, "Ctrl")
        .replace(/⌥/g, "Alt")
        .replace(/Opt/g, "Alt")
        .replace(/⇧/g, "Shift")
        .replace(/⌃/g, "Ctrl")
    }
    return keys.replace(/Ctrl/g, "⌘").replace(/Alt/g, "⌥").replace(/Shift/g, "⇧")
  }

  const filteredShortcuts = tool.shortcuts.filter(
    (shortcut) =>
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.keys.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const hasMultiplePlatforms = tool.shortcuts.some(
    (shortcut) => shortcut.keys.includes("Cmd") || shortcut.keys.includes("⌘") || shortcut.keys.includes("Ctrl"),
  )

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border space-y-4">
        {/* Row 1: Back button */}
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to search
          </Button>
        </div>

        {/* Row 2: Tool icon, name, and shortcut count */}
        <div className="flex items-center gap-3">
          <img
            src={getAppLogo(tool.name) || "/placeholder.svg"}
            alt={`${tool.name} logo`}
            className="w-12 h-12 rounded-lg"
          />
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{tool.name}</h1>
            <Badge variant="outline" className="text-sm">
              {tool.shortcuts.length} shortcuts
            </Badge>
          </div>
        </div>

        {/* Row 3: Tool description */}
        <div>
          <p className="text-muted-foreground">{getAppDescription(tool.name)}</p>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shortcuts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {hasMultiplePlatforms && (
              <Tabs value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as "mac" | "windows")}>
                <TabsList>
                  <TabsTrigger value="mac" className="flex items-center gap-2">
                    <Apple className="h-4 w-4" />
                    Mac
                  </TabsTrigger>
                  <TabsTrigger value="windows" className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Windows
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Shortcut</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShortcuts.map((shortcut, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {hasMultiplePlatforms
                              ? convertShortcutToPlatform(shortcut.keys, selectedPlatform)
                              : shortcut.keys}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm">{shortcut.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {shortcut.category || "General"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {filteredShortcuts.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No shortcuts found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
