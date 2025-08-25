"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Search, Monitor, Globe, Code, Briefcase, Palette, MessageSquare, HelpCircle, Filter } from "lucide-react"
import { shortcutsDatabase, searchShortcuts, type AppShortcuts, type Shortcut } from "@/lib/shortcuts-database"

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  onToolSelect: (tool: AppShortcuts) => void
}

const categoryIcons = {
  all: Monitor,
  os: Monitor,
  browser: Globe,
  development: Code,
  productivity: Briefcase,
  design: Palette,
  communication: MessageSquare,
  support: HelpCircle,
}

const categories = [
  { id: "all", label: "All", count: shortcutsDatabase.length },
  { id: "os", label: "Operating System", count: shortcutsDatabase.filter((app) => app.category === "os").length },
  { id: "browser", label: "Browsers", count: shortcutsDatabase.filter((app) => app.category === "browser").length },
  {
    id: "development",
    label: "Development",
    count: shortcutsDatabase.filter(
      (app) => ["development", "app"].includes(app.category) && ["VS Code", "GitHub"].includes(app.name),
    ).length,
  },
  {
    id: "productivity",
    label: "Productivity",
    count: shortcutsDatabase.filter(
      (app) =>
        ["app"].includes(app.category) && ["Linear", "Jira", "Notion", "Excel", "Google Sheets"].includes(app.name),
    ).length,
  },
  { id: "design", label: "Design", count: shortcutsDatabase.filter((app) => app.name === "Figma").length },
  {
    id: "communication",
    label: "Communications",
    count: shortcutsDatabase.filter((app) => ["Slack", "Gmail", "Intercom"].includes(app.name)).length,
  },
  { id: "support", label: "Support", count: shortcutsDatabase.filter((app) => app.name === "ChatGPT").length },
]

interface ActionSearchResult {
  shortcut: Shortcut
  appName: string
  appLogo: string
}

export function SidePanel({ isOpen, onClose, onToolSelect }: SidePanelProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const isActionSearch = (query: string) => {
    return query.length > 2 && !query.includes("+") && !query.includes("ctrl") && !query.includes("cmd")
  }

  const getActionSearchResults = (): ActionSearchResult[] => {
    if (!searchQuery || !isActionSearch(searchQuery)) return []

    const results: ActionSearchResult[] = []
    const matchingShortcuts = searchShortcuts(searchQuery)

    matchingShortcuts.forEach((shortcut) => {
      const app = shortcutsDatabase.find((app) =>
        app.shortcuts.some((s) => s.keys === shortcut.keys && s.description === shortcut.description),
      )
      if (app) {
        results.push({
          shortcut,
          appName: app.name,
          appLogo: getAppLogo(app.name),
        })
      }
    })

    return results.slice(0, 10) // Limit results
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const getFilteredApps = () => {
    let filtered = shortcutsDatabase

    if (activeCategory !== "all") {
      if (activeCategory === "development") {
        filtered = filtered.filter((app) => ["VS Code", "GitHub"].includes(app.name))
      } else if (activeCategory === "productivity") {
        filtered = filtered.filter((app) => ["Linear", "Jira", "Notion", "Excel", "Google Sheets"].includes(app.name))
      } else if (activeCategory === "design") {
        filtered = filtered.filter((app) => app.name === "Figma")
      } else if (activeCategory === "communication") {
        filtered = filtered.filter((app) => ["Slack", "Gmail", "Intercom"].includes(app.name))
      } else if (activeCategory === "support") {
        filtered = filtered.filter((app) => app.name === "ChatGPT")
      } else {
        filtered = filtered.filter((app) => app.category === activeCategory)
      }
    }

    if (searchQuery && !isActionSearch(searchQuery)) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }

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
    return logoMap[appName] || "/placeholder.svg?height=32&width=32"
  }

  const getAppDescription = (appName: string) => {
    const descriptions: Record<string, string> = {
      Chrome: "Google's web browser with extensive shortcuts",
      Safari: "Apple's web browser for Mac and iOS",
      Firefox: "Mozilla's open-source web browser",
      macOS: "Apple's desktop operating system shortcuts",
      Windows: "Microsoft Windows operating system shortcuts",
      Linux: "Linux desktop environment shortcuts",
      "VS Code": "Microsoft's code editor with powerful shortcuts",
      Linear: "Modern issue tracking with keyboard-first design",
      Jira: "Atlassian's project management and issue tracking",
      Notion: "All-in-one workspace for notes and collaboration",
      ChatGPT: "OpenAI's conversational AI assistant",
      Slack: "Team communication and collaboration platform",
      Figma: "Collaborative design and prototyping tool",
      GitHub: "Git repository hosting and collaboration",
      Gmail: "Google's email service with keyboard shortcuts",
      Excel: "Microsoft's spreadsheet application",
      "Google Sheets": "Google's cloud-based spreadsheet tool",
      Intercom: "Customer support and messaging platform",
    }
    return descriptions[appName] || "Keyboard shortcuts for this application"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-96 bg-sidebar border-l border-sidebar-border shadow-2xl flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Browse Shortcuts</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 border-b border-sidebar-border flex-shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications or actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="px-3 bg-transparent">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="end">
                <div className="space-y-1">
                  {categories.map((category) => {
                    const Icon = categoryIcons[category.id as keyof typeof categoryIcons]
                    return (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <Icon className="h-3 w-3" />
                        {category.label}
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {category.count}
                        </Badge>
                      </Button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {searchQuery && isActionSearch(searchQuery) ? (
                <>
                  <div className="text-sm font-medium text-muted-foreground mb-3">
                    Action results for "{searchQuery}"
                  </div>
                  {getActionSearchResults().map((result, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow p-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={result.appLogo || "/placeholder.svg"}
                          alt={`${result.appName} logo`}
                          className="w-6 h-6 rounded flex-shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{result.appName}</span>
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              {result.shortcut.keys}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {highlightText(result.shortcut.description, searchQuery)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </>
              ) : (
                getFilteredApps().map((app) => (
                  <Card
                    key={app.name}
                    className="cursor-pointer hover:shadow-md transition-shadow p-3"
                    onClick={() => onToolSelect(app)}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={getAppLogo(app.name) || "/placeholder.svg"}
                        alt={`${app.name} logo`}
                        className="w-6 h-6 rounded flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-1">{app.name}</div>
                        <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {getAppDescription(app.name)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {app.shortcuts.length} shortcuts
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
