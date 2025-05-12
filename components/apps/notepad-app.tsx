"use client"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useFileSystem } from "@/components/file-system"
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, useMenu } from "@/components/ui/simple-menu"

interface NotepadAppProps {
  initialFileId?: string
}

export default function NotepadApp({ initialFileId }: NotepadAppProps) {
  const [text, setText] = useState("")
  const [currentFile, setCurrentFile] = useState<string | null>(initialFileId || null)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [openDialogOpen, setOpenDialogOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  const [fontFamily, setFontFamily] = useState("font-mono")
  const [fontSize, setFontSize] = useState("text-sm")
  const [wordWrap, setWordWrap] = useState(true)

  const { createFile, updateFile, getFileById, files } = useFileSystem()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Menu state
  const fileMenu = useMenu()
  const editMenu = useMenu()
  const formatMenu = useMenu()
  const viewMenu = useMenu()
  const helpMenu = useMenu()
  const fontMenu = useMenu()
  const fontSizeMenu = useMenu()

  // Load file content if initialFileId is provided
  useEffect(() => {
    if (initialFileId) {
      const file = getFileById(initialFileId)
      if (file) {
        setText(file.content)
        setCurrentFile(file.id)
        setFileName(file.name)
      }
    }
  }, [initialFileId, getFileById])

  const handleSave = () => {
    if (currentFile) {
      // Update existing file
      updateFile(currentFile, text)
      setSaveDialogOpen(false)
    } else {
      // Create new file
      if (fileName.trim()) {
        const extension = fileName.includes(".") ? fileName.split(".").pop() || "txt" : "txt"
        const newFile = createFile(fileName, text, extension, null)
        setCurrentFile(newFile.id)
        setSaveDialogOpen(false)
      }
    }
  }

  const handleOpen = (fileId: string) => {
    const file = getFileById(fileId)
    if (file) {
      setText(file.content)
      setCurrentFile(file.id)
      setFileName(file.name)
    }
    setOpenDialogOpen(false)
  }

  const handleNew = () => {
    setText("")
    setCurrentFile(null)
    setFileName("")
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

  const textFiles = files.filter((file) => file.type === "txt")

  // Close all other menus when one is opened
  const closeAllMenus = (except?: string) => {
    if (except !== "file") fileMenu.close()
    if (except !== "edit") editMenu.close()
    if (except !== "format") formatMenu.close()
    if (except !== "view") viewMenu.close()
    if (except !== "help") helpMenu.close()
    if (except !== "font") fontMenu.close()
    if (except !== "fontSize") fontSizeMenu.close()
  }

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <div className="mb-2 flex items-center space-x-2 text-xs">
        <Menu>
          <MenuButton
            className="rounded px-2 py-1 hover:bg-secondary"
            onClick={() => {
              closeAllMenus("file")
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
              closeAllMenus("edit")
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
              closeAllMenus("format")
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
                closeAllMenus("font")
                fontMenu.toggle()
              }}
            >
              Font
            </MenuItem>
            <MenuList isOpen={fontMenu.isOpen} onClose={fontMenu.close}>
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
            </MenuList>
            <MenuItem
              onClick={() => {
                closeAllMenus("fontSize")
                fontSizeMenu.toggle()
              }}
            >
              Font Size
            </MenuItem>
            <MenuList isOpen={fontSizeMenu.isOpen} onClose={fontSizeMenu.close}>
              <MenuItem
                onClick={() => {
                  setFontSize("text-xs")
                  fontSizeMenu.close()
                }}
              >
                {fontSize === "text-xs" ? "✓ " : ""}Small
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFontSize("text-sm")
                  fontSizeMenu.close()
                }}
              >
                {fontSize === "text-sm" ? "✓ " : ""}Medium
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFontSize("text-base")
                  fontSizeMenu.close()
                }}
              >
                {fontSize === "text-base" ? "✓ " : ""}Large
              </MenuItem>
            </MenuList>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            className="rounded px-2 py-1 hover:bg-secondary"
            onClick={() => {
              closeAllMenus("view")
              viewMenu.toggle()
            }}
          >
            View
          </MenuButton>
          <MenuList isOpen={viewMenu.isOpen} onClose={viewMenu.close}>
            <MenuItem onClick={() => viewMenu.close()}>Status Bar</MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            className="rounded px-2 py-1 hover:bg-secondary"
            onClick={() => {
              closeAllMenus("help")
              helpMenu.toggle()
            }}
          >
            Help
          </MenuButton>
          <MenuList isOpen={helpMenu.isOpen} onClose={helpMenu.close}>
            <MenuItem onClick={() => helpMenu.close()}>About Notepad</MenuItem>
          </MenuList>
        </Menu>
      </div>

      <Textarea
        ref={textareaRef}
        className={`flex-1 resize-none border-input bg-background text-foreground ${fontFamily} ${fontSize} ${
          wordWrap ? "" : "whitespace-nowrap"
        }`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing..."
        wrap={wordWrap ? "soft" : "off"}
      />

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save File</DialogTitle>
          </DialogHeader>
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="File name (e.g. document.txt)"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Open Dialog */}
      <Dialog open={openDialogOpen} onOpenChange={setOpenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open File</DialogTitle>
          </DialogHeader>
          <div className="max-h-60 overflow-y-auto">
            {textFiles.length === 0 ? (
              <p className="text-center text-muted-foreground">No text files found</p>
            ) : (
              <div className="space-y-2">
                {textFiles.map((file) => (
                  <Button
                    key={file.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleOpen(file.id)}
                  >
                    {file.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
