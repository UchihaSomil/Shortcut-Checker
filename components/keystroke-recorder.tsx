"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Zap } from "lucide-react"

interface KeystrokeRecorderProps {
  onKeystrokeCapture: (keystroke: string) => void
  onClose: () => void
}

export function KeystrokeRecorder({ onKeystrokeCapture, onClose }: KeystrokeRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [capturedKeys, setCapturedKeys] = useState<string[]>([])
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [showSuccess, setShowSuccess] = useState(false)
  const recordingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      startRecording()
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isRecording) return

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const newPressedKeys = new Set(pressedKeys)

      // Add modifier keys with proper detection
      if (e.metaKey || e.key === "Meta") newPressedKeys.add("⌘")
      if (e.ctrlKey || e.key === "Control") newPressedKeys.add("Ctrl")
      if (e.altKey || e.key === "Alt") newPressedKeys.add("⌥")
      if (e.shiftKey || e.key === "Shift") newPressedKeys.add("⇧")

      // Add the main key (if it's not a modifier)
      if (!["Meta", "Control", "Alt", "Shift"].includes(e.key)) {
        let keyName = e.key

        switch (e.key) {
          case " ":
            keyName = "Space"
            break
          case "ArrowUp":
            keyName = "↑"
            break
          case "ArrowDown":
            keyName = "↓"
            break
          case "ArrowLeft":
            keyName = "←"
            break
          case "ArrowRight":
            keyName = "→"
            break
          case "Backspace":
            keyName = "⌫"
            break
          case "Delete":
            keyName = "⌦"
            break
          case "Enter":
            keyName = "↩"
            break
          case "Tab":
            keyName = "⇥"
            break
          case "Escape":
            keyName = "⎋"
            break
          default:
            if (keyName.length === 1) {
              keyName = keyName.toUpperCase()
            }
        }

        newPressedKeys.add(keyName)
      }

      setPressedKeys(newPressedKeys)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setTimeout(() => {
        if (pressedKeys.size > 0) {
          const keysArray = Array.from(pressedKeys)
          setCapturedKeys(keysArray)

          // Format the keystroke with proper symbols
          const formatted = keysArray.join("+")

          setShowSuccess(true)
          setIsRecording(false)

          setTimeout(() => {
            onKeystrokeCapture(formatted)
          }, 800)

          setPressedKeys(new Set())
        }
      }, 100)
    }

    document.addEventListener("keydown", handleKeyDown, true)
    document.addEventListener("keyup", handleKeyUp, true)

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true)
      document.removeEventListener("keyup", handleKeyUp, true)
    }
  }, [isRecording, pressedKeys, onKeystrokeCapture])

  const startRecording = () => {
    setIsRecording(true)
    setCapturedKeys([])
    setPressedKeys(new Set())
    setShowSuccess(false)
    recordingRef.current?.focus()
  }

  const renderKey = (key: string) => {
    const isModifier = ["⌘", "Ctrl", "⌥", "⇧"].includes(key)
    return (
      <Badge
        key={key}
        variant="secondary"
        className={`px-3 py-2 text-sm font-mono ${
          isModifier ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-gray-100 border-gray-300 text-gray-800"
        } border shadow-sm`}
      >
        {key}
      </Badge>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <Card className="w-[480px] bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Record Keyboard Shortcut</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isRecording && !showSuccess && capturedKeys.length === 0 && (
            <div className="text-center space-y-4">
              <div className="text-gray-600">Press the button below and then press your keyboard shortcut</div>
              <Button
                onClick={startRecording}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            </div>
          )}

          {isRecording && (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Recording...
                </div>
                <div className="text-gray-500 text-sm">Press your keyboard shortcut now</div>
              </div>

              {/* Recording display area */}
              <div
                ref={recordingRef}
                className="min-h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                tabIndex={0}
              >
                {pressedKeys.size > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {Array.from(pressedKeys).map((key, index) => (
                      <div key={index} className="flex items-center animate-in slide-in-from-bottom-2 duration-200">
                        {index > 0 && <span className="mx-2 text-gray-400 text-lg">+</span>}
                        {renderKey(key)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="text-lg mb-1">⌨️</div>
                    <div>Waiting for input...</div>
                  </div>
                )}
              </div>

              <Button variant="outline" onClick={() => setIsRecording(false)} className="w-full">
                Cancel Recording
              </Button>
            </div>
          )}

          {showSuccess && capturedKeys.length > 0 && (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Captured!
                </div>
                <div className="text-gray-500 text-sm">Successfully recorded your shortcut</div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {capturedKeys.map((key, index) => (
                    <div
                      key={index}
                      className="flex items-center animate-in zoom-in duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {index > 0 && <span className="mx-2 text-gray-400 text-lg">+</span>}
                      {renderKey(key)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={startRecording} variant="outline" className="flex-1 bg-transparent">
                  Record Again
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Use This Shortcut
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
