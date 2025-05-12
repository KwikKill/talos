"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, RefreshCw, Home, Search } from "lucide-react"

export default function BrowserApp() {
  const [url, setUrl] = useState("https://example.com")
  const [displayUrl, setDisplayUrl] = useState("https://example.com")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<string[]>(["https://example.com"])
  const [historyIndex, setHistoryIndex] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault()
    navigateToUrl(url)
  }

  const navigateToUrl = (targetUrl: string) => {
    // Add https:// if not present
    let processedUrl = targetUrl
    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl
    }

    setIsLoading(true)
    setUrl(processedUrl)
    setDisplayUrl(processedUrl)

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(processedUrl)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setUrl(history[historyIndex - 1])
      setDisplayUrl(history[historyIndex - 1])
    }
  }

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setUrl(history[historyIndex + 1])
      setDisplayUrl(history[historyIndex + 1])
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = url
    }
  }

  const handleHome = () => {
    navigateToUrl("https://example.com")
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <div className="mb-2 flex items-center space-x-2 p-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack} disabled={historyIndex <= 0}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleForward}
          disabled={historyIndex >= history.length - 1}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleHome}>
          <Home className="h-4 w-4" />
        </Button>

        <form onSubmit={handleNavigate} className="flex flex-1">
          <div className="relative flex-1">
            <Input
              type="text"
              value={displayUrl}
              onChange={(e) => setDisplayUrl(e.target.value)}
              className="h-8 pr-8"
            />
            <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" />
          </div>
        </form>
      </div>

      <div className="relative flex-1 overflow-hidden bg-background">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background bg-opacity-80">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={url}
          className="h-full w-full border-0"
          onLoad={handleIframeLoad}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title="Browser"
        />
      </div>
    </div>
  )
}
