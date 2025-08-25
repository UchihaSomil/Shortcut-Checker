"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import { useState } from "react"

interface SearchResultItemProps {
  appName: string
  appLogo?: string
  shortcutKeys: string
  description: string
  conflictLevel: "warning" | "info"
}

export function SearchResultItem({
  appName,
  appLogo,
  shortcutKeys,
  description,
  conflictLevel,
}: SearchResultItemProps) {
  const isWarning = conflictLevel === "warning"
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
        isWarning
          ? "border-orange-200 bg-orange-50/50 hover:bg-orange-100/70"
          : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/70"
      }`}
    >
      {/* App Icon */}
      <div className="flex-shrink-0">
        {appLogo && !imageError ? (
          <Image
            src={appLogo || "/placeholder.svg"}
            alt={`${appName} logo`}
            width={24}
            height={24}
            className="rounded"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-700">{appName.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">{appName}</span>
          <span className="text-sm text-muted-foreground truncate">{description}</span>
        </div>
      </div>

      {/* Shortcut Keys */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <Badge variant="secondary" className="font-mono text-xs">
          {shortcutKeys}
        </Badge>
        {isWarning && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p>This shortcut is used in browser/OS and might conflict</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}
