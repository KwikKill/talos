"use client"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useFileSystem } from "@/components/file-system"
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, useMenu } from "@/components/ui/simple-menu"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Folder,
  File,
  ArrowUp,
  FolderPlus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ZoomIn,
  ZoomOut,
  List,
  Eye,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NotepadAppProps {
  initialFileId?: string
}

export default function NotepadApp({ initialFileId }: NotepadAppProps) {
  const { toast } = useToast()
  const [text, setText] = useState("")
  const [currentFile, setCurrentFile] = useState<string | null>(initialFileId || null)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [openDialogOpen, setOpenDialogOpen] = useState(false)
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  const [fontFamily, setFontFamily] = useState("font-mono")
  const [textColor, setTextColor] = useState("text-foreground")
  const [bgColor, setBgColor] = useState("bg-background")
  const [textAlign, setTextAlign] = useState("text-left")
  const [wordWrap, setWordWrap] = useState(true)
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [showLineNumbers, setShowLineNumbers] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [scrollTop, setScrollTop] = useState(0)

  const {
    createFile,
    updateFile,
    getFileById,
    files,
    folders,
    createFolder,
    getFolderById,
    getFilesInFolder,
    getFoldersInFolder,
    navigateToFolder,
    getCurrentPath,
  } = useFileSystem()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  // Menu state
  const fileMenu = useMenu()
  const editMenu = useMenu()
  const formatMenu = useMenu()
  const viewMenu = useMenu()
  const fontMenu = useMenu()
  const fontSizeMenu = useMenu()
  const colorMenu = useMenu()
  const bgColorMenu = useMenu()
  const alignMenu = useMenu()
  const zoomMenu = useMenu()

  // Load file content if initialFileId is provided
  useEffect(() => {
    if (initialFileId) {
      const file = getFileById(initialFileId)
      if (file) {
        setText(file.content)
        setCurrentFile(file.id)
        setFileName(file.name)
        setHasUnsavedChanges(false)
      }
    }
  }, [initialFileId, getFileById])

  // Track unsaved changes
  useEffect(() => {
    if (currentFile) {
      const file = getFileById(currentFile)
      if (file && file.content !== text) {
        setHasUnsavedChanges(true)
      } else {
        setHasUnsavedChanges(false)
      }
    } else if (text) {
      setHasUnsavedChanges(true)
    } else {
      setHasUnsavedChanges(false)
    }
  }, [text, currentFile, getFileById])

  // Sync line numbers with textarea scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (textareaRef.current) {
        setScrollTop(textareaRef.current.scrollTop)
      }
    }

    const textarea = textareaRef.current
    if (textarea) {
      textarea.addEventListener("scroll", handleScroll)
      return () => textarea.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSave = () => {
    if (currentFile) {
      // Update existing file
      updateFile(currentFile, text)
      setHasUnsavedChanges(false)
      setSaveDialogOpen(false)
      toast({
        title: "File saved",
        description: `${fileName} has been saved successfully.`,
        duration: 3000,
      })
    } else {
      // Create new file
      if (fileName.trim()) {
        const extension = fileName.includes(".") ? fileName.split(".").pop() || "txt" : "txt"
        const newFile = createFile(fileName, text, extension, currentFolder)
        setCurrentFile(newFile.id)
        setHasUnsavedChanges(false)
        setSaveDialogOpen(false)
        toast({
          title: "File created",
          description: `${fileName} has been created successfully.`,
          duration: 3000,
        })
      }
    }
  }

  const handleOpen = (fileId: string) => {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Do you want to continue without saving?")) {
        return
      }
    }

    const file = getFileById(fileId)
    if (file) {
      setText(file.content)
      setCurrentFile(file.id)
      setFileName(file.name)
      setHasUnsavedChanges(false)
    }
    setOpenDialogOpen(false)
  }

  const handleNew = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Do you want to continue without saving?")) {
        return
      }
    }

    setText("")
    setCurrentFile(null)
    setFileName("")
    setHasUnsavedChanges(false)
    fileMenu.close()
  }

  const handleSaveAs = () => {
    setFileName(currentFile ? getFileById(currentFile)?.name || "" : "")
    setSaveDialogOpen(true)
    fileMenu.close()
  }

  const handleCut = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selectedText = text.substring(start, end)

      navigator.clipboard.writeText(selectedText)

      const newText = text.substring(0, start) + text.substring(end)
      setText(newText)
    }
    editMenu.close()
  }

  const handleCopy = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selectedText = text.substring(start, end)

      navigator.clipboard.writeText(selectedText)
    }
    editMenu.close()
  }

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()

      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart
        const end = textareaRef.current.selectionEnd

        const newText = text.substring(0, start) + clipboardText + text.substring(end)
        setText(newText)
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err)
    }
    editMenu.close()
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName, currentFolder)
      setNewFolderDialogOpen(false)
      setNewFolderName("")
    }
  }

  const handleNavigateUp = () => {
    if (!currentFolder) return
    const parentFolder = getFolderById(currentFolder)
    setCurrentFolder(parentFolder?.parentId || null)
  }

  const getCurrentFolderPath = () => {
    if (!currentFolder) return "C:\\"

    const pathParts: string[] = []
    let currentFolderId: string | null = currentFolder

    while (currentFolderId) {
      const folder = folders.find((f) => f.id === currentFolderId)
      if (folder) {
        pathParts.unshift(folder.name)
        currentFolderId = folder.parentId
      } else {
        break
      }
    }

    return `C:\\${pathParts.join("\\")}${pathParts.length > 0 ? "\\" : ""}`
  }

  const currentFolderPath = getCurrentFolderPath()
  const currentFolders = getFoldersInFolder(currentFolder)
  const currentFiles = getFilesInFolder(currentFolder).filter((file) => file.type === "txt")

  // Calculate cursor position and line/column info
  const getCursorPosition = () => {
    if (!textareaRef.current) return { line: 1, column: 1 }

    const cursorPosition = textareaRef.current.selectionStart
    const textBeforeCursor = text.substring(0, cursorPosition)
    const lines = textBeforeCursor.split("\n")
    const line = lines.length
    const column = lines[lines.length - 1].length + 1

    return { line, column }
  }

  const { line, column } = getCursorPosition()
  const totalLines = text.split("\n").length
  const totalChars = text.length

  // Close all other menus when one is opened
  const closeAllMenus = (except?: string[]) => {
    except = except || []

    if (!except.includes("file")) fileMenu.close()
    if (!except.includes("edit")) editMenu.close()
    if (!except.includes("format")) formatMenu.close()
    if (!except.includes("view")) viewMenu.close()
    if (!except.includes("font")) fontMenu.close()
    if (!except.includes("fontSize")) fontSizeMenu.close()
    if (!except.includes("color")) colorMenu.close()
    if (!except.includes("bgColor")) bgColorMenu.close()
    if (!except.includes("align")) alignMenu.close()
    if (!except.includes("zoom")) zoomMenu.close()
  }

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200))
    zoomMenu.close()
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50))
    zoomMenu.close()
  }

  const handleResetZoom = () => {
    setZoomLevel(100)
    zoomMenu.close()
  }

  // Generate line numbers
  const lineNumbers = showLineNumbers ? (
    <div
      ref={lineNumbersRef}
      className="absolute left-0 top-0 min-h-full w-10 overflow-hidden bg-muted/30 text-right pr-2 select-none pt-2"
      style={{
        fontSize: `${zoomLevel}%`,
        transform: `translateY(-${scrollTop}px)`,
      }}
    >
      {text.split("\n").map((_, i) => (
        <div key={i} className="text-muted-foreground">
          {i + 1}
        </div>
      ))}
    </div>
  ) : null

  // Combined file browser items for dialogs
  const fileBrowserItems = [
    ...currentFolders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      type: "folder" as const,
      icon: <Folder className="h-4 w-4 text-yellow-500" />,
      action: () => setCurrentFolder(folder.id),
    })),
    ...currentFiles.map((file) => ({
      id: file.id,
      name: file.name,
      type: "file" as const,
      icon: <File className="h-4 w-4 text-blue-500" />,
      action: () => (openDialogOpen ? handleOpen(file.id) : setFileName(file.name)),
    })),
  ]

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <div className="mb-2 flex items-center space-x-2 text-xs">
        <Menu>
          <MenuButton
            className="rounded px-2 py-1 hover:bg-secondary"
            onClick={() => {
              closeAllMenus(["file"])
              fileMenu.toggle()
            }}
          >
            File
          </MenuButton>
          <MenuList isOpen={fileMenu.isOpen} onClose={fileMenu.close}>
            <MenuItem onClick={handleNew}>New</MenuItem>
            <MenuItem
              onClick={() => {
                setOpenDialogOpen(true)
                setCurrentFolder(null) // Reset to root folder when opening
                fileMenu.close()
              }}
            >
              Open...
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSave()
                fileMenu.close()
              }}
              disabled={!currentFile && !fileName.trim()}
            >
              Save
            </MenuItem>
            <MenuItem onClick={handleSaveAs}>Save As...</MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => fileMenu.close()}>Exit</MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            className="rounded px-2 py-1 hover:bg-secondary"
            onClick={() => {
              closeAllMenus(["edit"])
              editMenu.toggle()
            }}
          >
            Edit
          </MenuButton>
          <MenuList isOpen={editMenu.isOpen} onClose={editMenu.close}>
            <MenuItem onClick={handleCut}>Cut</MenuItem>
            <MenuItem onClick={handleCopy}>Copy</MenuItem>
            <MenuItem onClick={handlePaste}>Paste</MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() => {
                setText("")
                editMenu.close()
              }}
            >
              Clear All
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            className="rounded px-2 py-1 hover:bg-secondary"
            onClick={() => {
              closeAllMenus(["format"])
              formatMenu.toggle()
            }}
          >
            Format
          </MenuButton>
          <MenuList isOpen={formatMenu.isOpen} onClose={formatMenu.close}>
            <MenuItem
              onClick={() => {
                setWordWrap(!wordWrap)
                formatMenu.close()
              }}
            >
              {wordWrap ? "✓ Word Wrap" : "Word Wrap"}
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() => {
                closeAllMenus(["format", "font"])
                fontMenu.toggle()
              }}
            >
              Font
            </MenuItem>
            <MenuList isOpen={fontMenu.isOpen} onClose={fontMenu.close} right>
              <MenuItem
                className="font-mono"
                onClick={() => {
                  setFontFamily("font-mono")
                  fontMenu.close()
                }}
              >
                {fontFamily === "font-mono" ? "✓ " : ""}Monospace
              </MenuItem>
              <MenuItem
                className="font-sans"
                onClick={() => {
                  setFontFamily("font-sans")
                  fontMenu.close()
                }}
              >
                {fontFamily === "font-sans" ? "✓ " : ""}Sans Serif
              </MenuItem>
              <MenuItem
                className="font-serif"
                onClick={() => {
                  setFontFamily("font-serif")
                  fontMenu.close()
                }}
              >
                {fontFamily === "font-serif" ? "✓ " : ""}Serif
              </MenuItem>
              <MenuItem
                className="font-handwriting"
                onClick={() => {
                  setFontFamily("font-handwriting")
                  fontMenu.close()
                }}
              >
                {fontFamily === "font-handwriting" ? "✓ " : ""}Handwriting
              </MenuItem>
            </MenuList>
            <MenuItem
              onClick={() => {
                closeAllMenus(["format", "color"])
                colorMenu.toggle()
              }}
            >
              Text Color
            </MenuItem>
            <MenuList isOpen={colorMenu.isOpen} onClose={colorMenu.close} right>
              <MenuItem
                onClick={() => {
                  setTextColor("text-foreground")
                  colorMenu.close()
                }}
              >
                {textColor === "text-foreground" ? "✓ " : ""}Default
              </MenuItem>
              <MenuItem
                className="text-red-500"
                onClick={() => {
                  setTextColor("text-red-500")
                  colorMenu.close()
                }}
              >
                {textColor === "text-red-500" ? "✓ " : ""}Red
              </MenuItem>
              <MenuItem
                className="text-blue-500"
                onClick={() => {
                  setTextColor("text-blue-500")
                  colorMenu.close()
                }}
              >
                {textColor === "text-blue-500" ? "✓ " : ""}Blue
              </MenuItem>
              <MenuItem
                className="text-green-500"
                onClick={() => {
                  setTextColor("text-green-500")
                  colorMenu.close()
                }}
              >
                {textColor === "text-green-500" ? "✓ " : ""}Green
              </MenuItem>
              <MenuItem
                className="text-yellow-500"
                onClick={() => {
                  setTextColor("text-yellow-500")
                  colorMenu.close()
                }}
              >
                {textColor === "text-yellow-500" ? "✓ " : ""}Yellow
              </MenuItem>
              <MenuItem
                className="text-purple-500"
                onClick={() => {
                  setTextColor("text-purple-500")
                  colorMenu.close()
                }}
              >
                {textColor === "text-purple-500" ? "✓ " : ""}Purple
              </MenuItem>
            </MenuList>
            <MenuItem
              onClick={() => {
                closeAllMenus(["format", "bgColor"])
                bgColorMenu.toggle()
              }}
            >
              Background Color
            </MenuItem>
            <MenuList isOpen={bgColorMenu.isOpen} onClose={bgColorMenu.close} right>
              <MenuItem
                onClick={() => {
                  setBgColor("bg-background")
                  bgColorMenu.close()
                }}
              >
                {bgColor === "bg-background" ? "✓ " : ""}Default
              </MenuItem>
              <MenuItem
                className="bg-red-100 dark:bg-red-900"
                onClick={() => {
                  setBgColor("bg-red-100 dark:bg-red-900")
                  bgColorMenu.close()
                }}
              >
                {bgColor === "bg-red-100 dark:bg-red-900" ? "✓ " : ""}Red
              </MenuItem>
              <MenuItem
                className="bg-blue-100 dark:bg-blue-900"
                onClick={() => {
                  setBgColor("bg-blue-100 dark:bg-blue-900")
                  bgColorMenu.close()
                }}
              >
                {bgColor === "bg-blue-100 dark:bg-blue-900" ? "✓ " : ""}Blue
              </MenuItem>
              <MenuItem
                className="bg-green-100 dark:bg-green-900"
                onClick={() => {
                  setBgColor("bg-green-100 dark:bg-green-900")
                  bgColorMenu.close()
                }}
              >
                {bgColor === "bg-green-100 dark:bg-green-900" ? "✓ " : ""}Green
              </MenuItem>
              <MenuItem
                className="bg-yellow-100 dark:bg-yellow-900"
                onClick={() => {
                  setBgColor("bg-yellow-100 dark:bg-yellow-900")
                  bgColorMenu.close()
                }}
              >
                {bgColor === "bg-yellow-100 dark:bg-yellow-900" ? "✓ " : ""}Yellow
              </MenuItem>
              <MenuItem
                className="bg-purple-100 dark:bg-purple-900"
                onClick={() => {
                  setBgColor("bg-purple-100 dark:bg-purple-900")
                  bgColorMenu.close()
                }}
              >
                {bgColor === "bg-purple-100 dark:bg-purple-900" ? "✓ " : ""}Purple
              </MenuItem>
            </MenuList>
            <MenuItem
              onClick={() => {
                closeAllMenus(["format", "align"])
                alignMenu.toggle()
              }}
            >
              Text Alignment
            </MenuItem>
            <MenuList isOpen={alignMenu.isOpen} onClose={alignMenu.close} right>
              <MenuItem
                onClick={() => {
                  setTextAlign("text-left")
                  alignMenu.close()
                }}
              >
                <div className="flex items-center">
                  <AlignLeft className="mr-2 h-4 w-4" />
                  {textAlign === "text-left" ? "✓ " : ""}Left
                </div>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setTextAlign("text-center")
                  alignMenu.close()
                }}
              >
                <div className="flex items-center">
                  <AlignCenter className="mr-2 h-4 w-4" />
                  {textAlign === "text-center" ? "✓ " : ""}Center
                </div>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setTextAlign("text-right")
                  alignMenu.close()
                }}
              >
                <div className="flex items-center">
                  <AlignRight className="mr-2 h-4 w-4" />
                  {textAlign === "text-right" ? "✓ " : ""}Right
                </div>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setTextAlign("text-justify")
                  alignMenu.close()
                }}
              >
                <div className="flex items-center">
                  <AlignJustify className="mr-2 h-4 w-4" />
                  {textAlign === "text-justify" ? "✓ " : ""}Justify
                </div>
              </MenuItem>
            </MenuList>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            className="rounded px-2 py-1 hover:bg-secondary"
            onClick={() => {
              closeAllMenus(["view"])
              viewMenu.toggle()
            }}
          >
            View
          </MenuButton>
          <MenuList isOpen={viewMenu.isOpen} onClose={viewMenu.close}>
            <MenuItem
              onClick={() => {
                setShowStatusBar(!showStatusBar)
                viewMenu.close()
              }}
            >
              <div className="flex items-center">{showStatusBar ? "✓ " : ""}Status Bar</div>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setShowLineNumbers(!showLineNumbers)
                viewMenu.close()
              }}
            >
              <div className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                {showLineNumbers ? "✓ " : ""}Line Numbers
              </div>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() => {
                closeAllMenus(["view", "zoom"])
                zoomMenu.toggle()
              }}
            >
              <div className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Zoom
              </div>
            </MenuItem>
            <MenuList isOpen={zoomMenu.isOpen} onClose={zoomMenu.close} right>
              <MenuItem onClick={handleZoomIn}>
                <div className="flex items-center">
                  <ZoomIn className="mr-2 h-4 w-4" />
                  Zoom In
                </div>
              </MenuItem>
              <MenuItem onClick={handleZoomOut}>
                <div className="flex items-center">
                  <ZoomOut className="mr-2 h-4 w-4" />
                  Zoom Out
                </div>
              </MenuItem>
              <MenuItem onClick={handleResetZoom}>
                <div className="flex items-center">Reset Zoom ({zoomLevel}%)</div>
              </MenuItem>
            </MenuList>
          </MenuList>
        </Menu>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {lineNumbers}
        <Textarea
          ref={textareaRef}
          className={`h-full w-full resize-none border-input ${fontFamily} ${textColor} ${bgColor} ${textAlign} ${
            wordWrap ? "" : "whitespace-nowrap"
          } ${showLineNumbers ? "pl-12" : ""}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing..."
          wrap={wordWrap ? "soft" : "off"}
          style={{
            fontSize: `${zoomLevel}%`,
            lineHeight: showLineNumbers ? "1.5" : "inherit",
          }}
        />
      </div>

      {showStatusBar && (
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
          <div>
            Ln {line}, Col {column}
          </div>
          <div>
            {totalLines} line{totalLines !== 1 ? "s" : ""}, {totalChars} character{totalChars !== 1 ? "s" : ""}
          </div>
          <div>{hasUnsavedChanges ? "Modified" : "Saved"}</div>
          <div>Zoom: {zoomLevel}%</div>
        </div>
      )}

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Save File</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handleNavigateUp} disabled={!currentFolder}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Input value={currentFolderPath} readOnly className="flex-1" />
              <Button variant="outline" size="icon" onClick={() => setNewFolderDialogOpen(true)}>
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-md p-2">
              <div className="font-medium mb-2">Files and Folders</div>
              <ScrollArea className="h-24">
                {fileBrowserItems.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4">This folder is empty</div>
                ) : (
                  <div className="space-y-1">
                    {fileBrowserItems.map((item) => (
                      <Button key={item.id} variant="ghost" className="w-full justify-start" onClick={item.action}>
                        {item.icon}
                        <span className="ml-2">{item.name}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filename">File name:</Label>
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name (e.g. document.txt)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!fileName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Open Dialog */}
      <Dialog open={openDialogOpen} onOpenChange={setOpenDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Open File</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handleNavigateUp} disabled={!currentFolder}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Input value={currentFolderPath} readOnly className="flex-1" />
              <Button variant="outline" size="icon" onClick={() => setNewFolderDialogOpen(true)}>
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-md p-2">
              <div className="font-medium mb-2">Files and Folders</div>
              <ScrollArea className="h-60">
                {fileBrowserItems.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4">This folder is empty</div>
                ) : (
                  <div className="space-y-1">
                    {fileBrowserItems.map((item) => (
                      <Button key={item.id} variant="ghost" className="w-full justify-start" onClick={item.action}>
                        {item.icon}
                        <span className="ml-2">{item.name}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Notepad</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <File className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">TalOS Notepad</h3>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            </div>
            <div className="text-sm">
              <p>TalOS Notepad is a simple text editor for the TalOS operating system.</p>
              <p className="mt-2">© 2025 TalOS Corporation. All rights reserved.</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setAboutDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
