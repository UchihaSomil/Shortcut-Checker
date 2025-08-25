import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info } from "lucide-react"
import Image from "next/image"

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

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
        isWarning ? "border-orange-200 bg-orange-50/50" : "border-blue-200 bg-blue-50/50"
      }`}
    >
      {/* App Icon */}
      <div className="flex-shrink-0">
        {appLogo ? (
          <Image
            src={appLogo || "/placeholder.svg"}
            alt={`${appName} logo`}
            width={24}
            height={24}
            className="rounded"
          />
        ) : (
          <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">{appName.charAt(0)}</span>
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
        {isWarning ? <AlertTriangle className="h-4 w-4 text-orange-600" /> : <Info className="h-4 w-4 text-blue-600" />}
      </div>
    </div>
  )
}
