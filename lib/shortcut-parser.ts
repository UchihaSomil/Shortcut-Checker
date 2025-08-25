export interface ParsedShortcut {
  keys: string
  normalized: string
  modifiers: string[]
  mainKey: string
}

/**
 * Normalizes shortcut text representations to symbols
 * cmd -> ⌘, option -> ⌥, shift -> ⇧, ctrl -> Ctrl
 */
export function normalizeShortcut(input: string): string {
  if (!input) return ""

  const normalized = input.trim()

  const parts = normalized
    .split(/[\s+\-_]+/) // Split by spaces, +, -, _ (one or more)
    .filter((part) => part.length > 0) // Remove empty parts
    .map((part) => part.trim()) // Trim each part
    .filter((part) => part.length > 0) // Remove any remaining empty parts

  // Normalize key representations (case insensitive)
  const replacements: Record<string, string> = {
    // Command key variations
    cmd: "⌘",
    command: "⌘",
    "⌘": "⌘",

    // Option/Alt key variations
    option: "⌥",
    opt: "⌥",
    alt: "⌥",
    "⌥": "⌥",

    // Shift key variations
    shift: "⇧",
    "⇧": "⇧",

    // Control key variations
    ctrl: "Ctrl",
    control: "Ctrl",
    "^": "Ctrl",

    // Meta key (Windows key)
    meta: "⊞",
    win: "⊞",
    windows: "⊞",
    super: "⊞",

    // Function keys
    fn: "Fn",
    function: "Fn",

    // Arrow keys
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
    arrowup: "↑",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",

    // Special keys
    space: "Space",
    spacebar: "Space",
    enter: "Enter",
    return: "Enter",
    tab: "Tab",
    escape: "Esc",
    esc: "Esc",
    delete: "Delete",
    del: "Delete",
    backspace: "Backspace",
    home: "Home",
    end: "End",
    pageup: "Page Up",
    pagedown: "Page Down",
    insert: "Insert",
  }

  const normalizedParts = parts.map((part) => {
    const trimmed = part.toLowerCase()
    return replacements[trimmed] || part
  })

  // Reorder modifiers in standard order: ⌘, Ctrl, ⌥, ⇧, then main key
  const modifierOrder = ["⌘", "Ctrl", "⌥", "⇧", "Fn"]
  const modifiers: string[] = []
  const otherKeys: string[] = []

  normalizedParts.forEach((part) => {
    if (modifierOrder.includes(part)) {
      modifiers.push(part)
    } else {
      otherKeys.push(part)
    }
  })

  // Sort modifiers by standard order
  modifiers.sort((a, b) => modifierOrder.indexOf(a) - modifierOrder.indexOf(b))

  // Combine modifiers + other keys
  const result = [...modifiers, ...otherKeys].join("+")

  return result
}

/**
 * Parses a shortcut string and returns detailed information
 */
export function parseShortcut(input: string): ParsedShortcut {
  const normalized = normalizeShortcut(input)
  const parts = normalized.split("+")

  const modifierKeys = ["⌘", "Ctrl", "⌥", "⇧", "Fn"]
  const modifiers = parts.filter((part) => modifierKeys.includes(part))
  const mainKeys = parts.filter((part) => !modifierKeys.includes(part))
  const mainKey = mainKeys[mainKeys.length - 1] || ""

  return {
    keys: normalized,
    normalized,
    modifiers,
    mainKey,
  }
}

/**
 * Checks if two shortcuts are equivalent
 */
export function shortcutsMatch(shortcut1: string, shortcut2: string): boolean {
  const normalized1 = normalizeShortcut(shortcut1)
  const normalized2 = normalizeShortcut(shortcut2)
  return normalized1.toLowerCase() === normalized2.toLowerCase()
}

/**
 * Formats a shortcut for display with proper spacing and symbols
 */
export function formatShortcutForDisplay(shortcut: string): string {
  const normalized = normalizeShortcut(shortcut)
  // Add proper spacing around + symbols for better readability
  return normalized.replace(/\+/g, " + ")
}
