"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Info, Keyboard, Menu } from "lucide-react"
import { KeystrokeRecorder } from "@/components/keystroke-recorder"
import { SidePanel } from "@/components/side-panel"
import { ToolDetailPage } from "@/components/tool-detail-page"
import { SearchResultItem } from "@/components/search-result-item"
import { findConflicts, shortcutsDatabase, type Shortcut, type AppShortcuts } from "@/lib/shortcuts-database"
import { normalizeShortcut, formatShortcutForDisplay } from "@/lib/shortcut-parser"

export default function ShortcutChecker() {
  const [inputShortcut, setInputShortcut] = useState("")
  const [conflicts, setConflicts] = useState<Shortcut[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [showRecorder, setShowRecorder] = useState(false)
  const [showSidePanel, setShowSidePanel] = useState(false)
  const [selectedTool, setSelectedTool] = useState<AppShortcuts | null>(null)

  const handleSearch = () => {
    if (!inputShortcut.trim()) return

    const normalizedShortcut = normalizeShortcut(inputShortcut.trim())
    const foundConflicts = findConflicts(normalizedShortcut)
    setConflicts(foundConflicts)
    setHasSearched(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleKeystrokeCapture = (keystroke: string) => {
    setInputShortcut(keystroke)
    setShowRecorder(false)
    setTimeout(() => {
      const foundConflicts = findConflicts(keystroke)
      setConflicts(foundConflicts)
      setHasSearched(true)
    }, 100)
  }

  const handleToolSelect = (tool: AppShortcuts) => {
    setSelectedTool(tool)
    setShowSidePanel(false)
  }

  const getAppLogo = (appName: string): string | undefined => {
    const logoMap: Record<string, string> = {
      Chrome: "/chrome-browser-logo.png",
      Safari: "/safari-browser-logo.png",
      Firefox: "/firefox-browser-logo.png",
      macOS: "/apple-macos-logo.png",
      Windows: "/windows-os-logo.png",
      Linux: "/linux-penguin-logo.png",
      "VS Code": "/visual-studio-code-logo.png",
      Linear: "/linear-logo.png",
      Notion: "/notion-logo.png",
      Slack: "/slack-logo.png",
      Figma: "/figma-logo.png",
      GitHub: "/github-logo.png",
    }
    return logoMap[appName]
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Keyboard className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">Shortcut Checker</span>
            </div>
            <Button variant="outline" onClick={() => setShowSidePanel(true)} className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Browse Shortcuts
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {selectedTool ? (
          <ToolDetailPage tool={selectedTool} onBack={() => setSelectedTool(null)} />
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                  <Keyboard className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4">Check Shortcut Conflicts</h1>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                  Discover if your app shortcuts conflict with popular browsers, operating systems, and applications.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your shortcut (e.g., cmd+k, ctrl+shift+p)"
                    value={inputShortcut}
                    onChange={(e) => setInputShortcut(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-14 text-lg bg-card border-border focus:border-primary focus:ring-primary/20 pr-12"
                  />
                  <Button
                    onClick={() => setShowRecorder(true)}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                  >
                    <Keyboard className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={!inputShortcut.trim()}
                  className="h-14 px-8 bg-primary hover:bg-primary/90"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Check
                </Button>
              </div>

              {hasSearched && (
                <div className="space-y-4 mt-8">
                  {conflicts.length === 0 ? (
                    <Alert className="border-emerald-200 bg-emerald-50">
                      <Info className="h-5 w-5 text-emerald-600" />
                      <AlertDescription className="text-emerald-800">
                        <strong>No conflicts found!</strong> The shortcut "
                        {formatShortcutForDisplay(normalizeShortcut(inputShortcut))}" appears to be safe to use.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Found {conflicts.length} conflict{conflicts.length > 1 ? "s" : ""} for "
                        {formatShortcutForDisplay(normalizeShortcut(inputShortcut))}"
                      </h3>
                      <div className="space-y-2">
                        {conflicts.map((conflict, index) => {
                          const app = shortcutsDatabase.find((app) =>
                            app.shortcuts.some(
                              (s) => s.keys === conflict.keys && s.description === conflict.description,
                            ),
                          )
                          const appName = app?.name || "Unknown"

                          return (
                            <SearchResultItem
                              key={`${appName}-${conflict.keys}-${index}`}
                              appName={appName}
                              appLogo={getAppLogo(appName)}
                              shortcutKeys={conflict.keys}
                              description={conflict.description}
                              conflictLevel={conflict.conflictLevel}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <SidePanel isOpen={showSidePanel} onClose={() => setShowSidePanel(false)} onToolSelect={handleToolSelect} />

      {showRecorder && (
        <KeystrokeRecorder onKeystrokeCapture={handleKeystrokeCapture} onClose={() => setShowRecorder(false)} />
      )}
    </div>
  )
}
