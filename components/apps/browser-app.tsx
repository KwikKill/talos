"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, RefreshCw, Home, Search, Globe, AlertTriangle, Wifi, Terminal } from "lucide-react"
import { useSystemSettings } from "@/components/system-settings-context"

// Custom Link component for internal navigation
const BrowserLink = ({
  href,
  children,
  className,
}: { href: string; children: React.ReactNode; className?: string }) => {
  return (
    <a
      href={href}
      className={className || "text-blue-500 hover:underline"}
      onClick={(e) => {
        // This is just to make the links look clickable
        // The actual click handling is done at the container level
        e.preventDefault()
      }}
    >
      {children}
    </a>
  )
}

const GabrielPortfolioMain = () => (
  <div className="min-h-full bg-black text-white">
    {/* Header */}
    <header className="border-b border-yellow-500/30 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-mono">
          <span className="text-gray-500">&lt;</span>
          <span className="text-yellow-400">KwikKill - Porfolio</span>
          <span className="text-gray-500">/&gt;</span>
        </h1>
      </div>
    </header>

    <div className="container mx-auto gap-8 p-6">
      {/* Left Column */}
      <div className="space-y-8">
        <div className="border border-green-500/30 rounded-md bg-black p-4">
          <div className="bg-gray-900 rounded-t-md p-2 flex items-center justify-between mb-4">
            <span className="text-sm font-mono">KWIKKILL@HYPERION:~</span>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-2">
            <span className="text-yellow-400">Gabriel</span> Blaisot
          </h1>
          <h2 className="text-2xl mb-6">
            Computer Science student
            <br />
            INSA Rennes
          </h2>

          <p className="text-gray-300 mb-4">
          Passionate about Web development and software engineering. I love video games, technology, and learning new things. Also passionate about Greek mythology.
          </p>

          <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-yellow-400 mb-2">CONTACT INFORMATION</h3>
            <div className="bg-gray-900 p-4 rounded-md text-center">
              <p
                className="text-gray-400 mb-2 cursor-pointer hover:text-yellow-400"
                onClick={(e) => {
                  // open a new tab with the link
                  window.open("https://gabriel.blaisot.org", "_blank")
                }}
              >
                CLICK TO REVEAL
              </p>
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-4 mt-6"
            onClick={(e) => {
              // open a new tab with the link
              window.open("https://gabriel.blaisot.org", "_blank")
            }}
          >
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded">
              Projects
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded">
              Experience
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
)

// Predefined websites
const websites = {
  "list.talos.com": {
    title: "TalOS Sites List",
    content: (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">TalOS Sites List</h1>
        <p className="mb-4">
          Welcome to the TalOS sites list! Here you can find links to various TalOS services and applications.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <BrowserLink href="https://talos.com">TalOS - The Virtual Operating System</BrowserLink>
          </li>
          <li>
            <BrowserLink href="https://news.talos.com">TalOS News</BrowserLink>
          </li>
          <li>
            <BrowserLink href="https://mail.talos.com">TalOS Mail</BrowserLink>
          </li>
          <li>
            <BrowserLink href="https://gabriel.blaisot.org">Gabriel Blaisot - Portfolio</BrowserLink>
          </li>
        </ul>
      </div>
    ),
  },
  "talos.com": {
    title: "TalOS - The Virtual Operating System",
    content: (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center mb-8">
          <Globe className="h-10 w-10 text-blue-500 mr-4" />
          <h1 className="text-3xl font-bold">TalOS</h1>
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex-1">
            <h2 className="text-xl font-semibold mb-2 text-center">Features</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Virtual Desktop</li>
              <li>File Management</li>
              <li>Text Editing</li>
              <li>Calculator</li>
              <li>Web Browsing</li>
            </ul>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg flex-1">
            <h2 className="text-xl font-semibold mb-2 text-center">Technology</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Built with React</li>
              <li>Next.js Framework</li>
              <li>Tailwind CSS</li>
              <li>TypeScript</li>
              <li>Modern Web Standards</li>
            </ul>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg flex-1">
            <h2 className="text-xl font-semibold mb-2 text-center">About</h2>
            <p>
              TalOS is a virtual operating system that runs entirely in your browser. It simulates the experience of a
              desktop OS with various applications and utilities.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  "news.talos.com": {
    title: "TalOS News",
    content: (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">TalOS News</h1>
        <div className="space-y-8">
          <article className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-2xl font-semibold mb-2">TalOS 1.0 Released</h2>
            <p className="text-sm text-gray-500 mb-4">May 12, 2025 • 5 min read</p>
            <div className="mb-4">
              <p>
                Today we're excited to announce the official release of TalOS 1.0, our virtual operating system that runs
                entirely in the browser. Visit <BrowserLink href="https://talos.com">our homepage</BrowserLink> to learn
                more.
              </p>
              <p className="text-sm text-gray-500">
                (This is a demo, not a real operating system. It's just a fun project made by a single CS student.)
              </p>
            </div>
            <BrowserLink href="https://news.talos.com">Read more →</BrowserLink>
          </article>
          <article className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-2xl font-semibold mb-2">New Applications Coming Soon</h2>
            <p className="text-sm text-gray-500 mb-4">May 10, 2025 • 3 min read</p>
            <div className="mb-4">
              We're working on several new applications for TalOS, including a Paint program, Music Player, and Terminal
              emulator.
              <p className="text-sm text-gray-500">
                (Not sure to add them though, that's a lot of work for just a demo)
              </p>
            </div>
            <BrowserLink href="https://news.talos.com">Read more →</BrowserLink>
          </article>
          <article className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-2xl font-semibold mb-2">Developer Documentation Updated</h2>
            <p className="text-sm text-gray-500 mb-4">May 8, 2025 • 2 min read</p>
            <div className="mb-4">
              We've updated our developer documentation with new guides on creating custom applications for TalOS.
              <p className="text-sm text-gray-500">
                (nope, you can't create custom applications for TalOS, that's still a fun demo, not a real app)
              </p>
            </div>
            <BrowserLink href="https://news.talos.com">Read more →</BrowserLink>
          </article>
        </div>
        <div className="mt-8 text-center">
          <BrowserLink href="https://talos.com" className="text-blue-500 hover:underline">
            ← Back to TalOS Homepage
          </BrowserLink>
        </div>
      </div>
    ),
  },
  "mail.talos.com": {
    title: "TalOS Mail",
    content: (
      <div className="h-full flex flex-col">
        <div className="bg-blue-500 text-white p-4">
          <h1 className="text-xl font-bold">TalOS Mail</h1>
        </div>
        <div className="flex flex-1">
          <div className="w-48 bg-gray-100 dark:bg-gray-800 p-4">
            <ul className="space-y-2">
              <li className="font-medium">Inbox (3)</li>
              <li>Sent</li>
              <li>Drafts</li>
              <li>Spam</li>
              <li>Trash</li>
            </ul>
            <div className="mt-8 pt-4 border-t">
              <BrowserLink href="https://talos.com" className="text-sm">
                Back to TalOS
              </BrowserLink>
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="space-y-2">
              <div className="border-b pb-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 cursor-pointer">
                <div>
                  <div className="font-medium">Welcome to TalOS Mail</div>
                  <div className="text-sm text-gray-500">TalOS Team - Welcome to your new email account...</div>
                </div>
                <div className="text-xs text-gray-500">10:30 AM</div>
              </div>
              <div className="border-b pb-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 cursor-pointer">
                <div>
                  <div className="font-medium">Your account security</div>
                  <div className="text-sm text-gray-500">
                    Security Team - We've noticed a new login to your account...
                  </div>
                </div>
                <div className="text-xs text-gray-500">Yesterday</div>
              </div>
              <div className="border-b pb-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 cursor-pointer">
                <div>
                  <div className="font-medium">TalOS Newsletter</div>
                  <div className="text-sm text-gray-500">
                    Updates - Check out the latest features and improvements...
                  </div>
                </div>
                <div className="text-xs text-gray-500">May 10</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  "gabriel.blaisot.org": {
    title: "Gabriel Blaisot - Portfolio",
    content: <GabrielPortfolioMain />,
  },
}

// DNS not found page
const DNSNotFoundPage = ({ url }: { url: string }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
    <h1 className="text-2xl font-bold mb-4">This site can't be reached</h1>
    <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-md">
      <span className="font-medium">{url}</span> could not be found. DNS address could not be resolved.
    </p>
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left max-w-md w-full mb-6">
      <h2 className="font-medium mb-2">Try:</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Checking the connection</li>
        <li>Checking the DNS configuration</li>
        <li>Running the Network Diagnostics</li>
      </ul>
    </div>
    <div className="flex space-x-4">
      <Button variant="outline" className="flex items-center">
        <RefreshCw className="h-4 w-4 mr-2" />
        Reload
      </Button>
      <Button variant="outline" className="flex items-center">
        <Wifi className="h-4 w-4 mr-2" />
        Network Diagnostics
      </Button>
    </div>
  </div>
)

// No connection page
const NoConnectionPage = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <Wifi className="h-16 w-16 text-red-500 mb-4" />
    <h1 className="text-2xl font-bold mb-4">No Internet Connection</h1>
    <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-md">Check your network connection and try again.</p>
    <Button variant="outline" className="flex items-center">
      <RefreshCw className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </div>
)

export default function BrowserApp() {
  const { settings } = useSystemSettings()
  const [url, setUrl] = useState("https://list.talos.com")
  const [displayUrl, setDisplayUrl] = useState("https://list.talos.com")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<string[]>(["https://list.talos.com"])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isConnected, setIsConnected] = useState(true)
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null)

  const navigateToUrl = useCallback(
    (targetUrl: string) => {
      // Add https:// if not present
      let processedUrl = targetUrl
      if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
        processedUrl = "https://" + processedUrl
      }

      // Scroll to top
      if (contentRef) {
        contentRef.parentElement?.scrollTo({ top: 0, behavior: "instant" })
      }

      setIsLoading(true)
      setUrl(processedUrl)
      setDisplayUrl(processedUrl)

      // Simulate loading
      setTimeout(() => {
        setIsLoading(false)

        // Randomly simulate connection issues (5% chance)
        const hasConnectionIssue = Math.random() < 0.05
        setIsConnected(!hasConnectionIssue)

        if (!hasConnectionIssue) {
          // Add to history
          const newHistory = history.slice(0, historyIndex + 1)
          newHistory.push(processedUrl)
          setHistory(newHistory)
          setHistoryIndex(newHistory.length - 1)
        }
      }, 800)
    },
    [history, historyIndex],
  )

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault()
    navigateToUrl(displayUrl)
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
    setTimeout(() => {
      setIsLoading(false)

      // Randomly simulate connection issues (5% chance)
      const hasConnectionIssue = Math.random() < 0.05
      setIsConnected(!hasConnectionIssue)
    }, 800)
  }

  const handleHome = () => {
    navigateToUrl("https://list.talos.com")
  }

  // Extract domain from URL
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch (e) {
      return url.replace(/^https?:\/\//, "").split("/")[0]
    }
  }

  // Handle clicks on links within the browser content
  useEffect(() => {
    if (!contentRef) return

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest("a")

      if (anchor && anchor.href) {
        e.preventDefault()
        navigateToUrl(anchor.href)
      }
    }

    contentRef.addEventListener("click", handleLinkClick)
    return () => {
      contentRef.removeEventListener("click", handleLinkClick)
    }
  }, [contentRef, navigateToUrl])

  const currentDomain = getDomain(url)
  const currentWebsite = websites[currentDomain as keyof typeof websites]

  // Render content based on connection and website availability
  const renderContent = () => {
    if (!settings.wifi || !isConnected) {
      return <NoConnectionPage />
    }

    if (currentWebsite) {
      return currentWebsite.content
    }

    return <DNSNotFoundPage url={currentDomain} />
  }

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <div className="mb-2 flex items-center space-x-2 p-2 border-b">
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

      <div className={`relative flex-1 ${isLoading ? "overflow-hidden" : "overflow-auto"} bg-white dark:bg-gray-900`}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background bg-opacity-80">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}

        <div className="min-h-full" ref={setContentRef}>
          {renderContent()}
        </div>
      </div>

      {/* Browser status bar */}
      <div className="border-t px-2 py-1 text-xs text-muted-foreground flex items-center">
        <div className="flex-1">
          {isConnected ? (
            <span className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              Secure connection
            </span>
          ) : (
            <span className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
              No connection
            </span>
          )}
        </div>
        <div>
          {currentWebsite ? currentWebsite.title : "Not Found"} | {currentDomain.split("/")[0]}
        </div>
      </div>
    </div>
  )
}
