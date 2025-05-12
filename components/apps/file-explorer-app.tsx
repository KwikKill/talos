"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import * as Icons from "lucide-react"
import { useFileSystem } from "@/components/file-system"

export default function FileExplorerApp() {
  const {
    files,
    folders,
    currentFolder,
    createFile,
    createFolder,
    deleteFile,
    deleteFolder,
    navigateToFolder,
    getCurrentPath,
    getFilesInFolder,
    getFoldersInFolder,
    getFolderById,
    renameFile,
    renameFolder,
  } = useFileSystem()

  const [selectedItem, setSelectedItem] = useState<{ id: string; type: "file" | "folder" } | null>(null)
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [newItemName, setNewItemName] = useState("")

  const currentFiles = getFilesInFolder(currentFolder)
  const currentFolders = getFoldersInFolder(currentFolder)
  const currentPath = getCurrentPath()

  const handleNavigateUp = () => {
    if (!currentFolder) return
    const parentFolder = getFolderById(currentFolder)
    navigateToFolder(parentFolder?.parentId || null)
  }

  const handleCreateFolder = () => {
    if (newItemName.trim()) {
      createFolder(newItemName, currentFolder)
      setNewFolderDialogOpen(false)
      setNewItemName("")
    }
  }

  const handleCreateFile = () => {
    if (newItemName.trim()) {
      const extension = newItemName.includes(".") ? newItemName.split(".").pop() || "txt" : "txt"
      createFile(newItemName, "", extension, currentFolder)
      setNewFileDialogOpen(false)
      setNewItemName("")
    }
  }

  const handleRename = () => {
    if (!selectedItem || !newItemName.trim()) return

    if (selectedItem.type === "file") {
      renameFile(selectedItem.id, newItemName)
    } else {
      renameFolder(selectedItem.id, newItemName)
    }

    setRenameDialogOpen(false)
    setNewItemName("")
    setSelectedItem(null)
  }

  const handleDelete = () => {
    if (!selectedItem) return

    if (selectedItem.type === "file") {
      deleteFile(selectedItem.id)
    } else {
      deleteFolder(selectedItem.id)
    }

    setSelectedItem(null)
  }

  const openRenameDialog = (item: { id: string; type: "file" | "folder"; name: string }) => {
    setSelectedItem({ id: item.id, type: item.type })
    setNewItemName(item.name)
    setRenameDialogOpen(true)
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "txt":
        return <Icons.FileText className="h-10 w-10 text-blue-500" />
      case "jpg":
      case "png":
      case "gif":
        return <Icons.Image className="h-10 w-10 text-green-500" />
      case "pdf":
        return <Icons.FileText className="h-10 w-10 text-red-500" />
      default:
        return <Icons.File className="h-10 w-10 text-gray-500" />
    }
  }

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <div className="flex items-center space-x-2 border-b p-2">
        <Button variant="ghost" size="icon" onClick={handleNavigateUp} disabled={!currentFolder}>
          <Icons.ArrowUp className="h-4 w-4" />
        </Button>
        <Input value={currentPath} readOnly className="flex-1 bg-muted/50" />
        <Button variant="ghost" size="icon" onClick={() => setNewFolderDialogOpen(true)}>
          <Icons.FolderPlus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setNewFileDialogOpen(true)}>
          <Icons.FilePlus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {currentFolders.length === 0 && currentFiles.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>This folder is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {currentFolders.map((folder) => (
              <div
                key={folder.id}
                className={`flex cursor-pointer flex-col items-center p-2 text-center hover:bg-accent hover:text-accent-foreground ${
                  selectedItem?.id === folder.id ? "bg-accent/50" : ""
                }`}
                onClick={() => setSelectedItem({ id: folder.id, type: "folder" })}
                onDoubleClick={() => navigateToFolder(folder.id)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setSelectedItem({ id: folder.id, type: "folder" })
                }}
              >
                <Icons.Folder className="h-10 w-10 text-yellow-500" />
                <span className="mt-1 max-w-full truncate text-xs">{folder.name}</span>
              </div>
            ))}

            {currentFiles.map((file) => (
              <div
                key={file.id}
                className={`flex cursor-pointer flex-col items-center p-2 text-center hover:bg-accent hover:text-accent-foreground ${
                  selectedItem?.id === file.id ? "bg-accent/50" : ""
                }`}
                onClick={() => setSelectedItem({ id: file.id, type: "file" })}
                onDoubleClick={() => {
                  // Open file based on type
                  // For now, we'll just select it
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setSelectedItem({ id: file.id, type: "file" })
                }}
              >
                {getFileIcon(file.type)}
                <span className="mt-1 max-w-full truncate text-xs">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="flex justify-between border-t p-2">
          <div>
            {selectedItem.type === "file"
              ? files.find((f) => f.id === selectedItem.id)?.name
              : folders.find((f) => f.id === selectedItem.id)?.name}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const item =
                  selectedItem.type === "file"
                    ? { ...files.find((f) => f.id === selectedItem.id), type: "file" as const }
                    : { ...folders.find((f) => f.id === selectedItem.id), type: "folder" as const }
                if (item) {
                  openRenameDialog(item as any)
                }
              }}
            >
              Rename
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive">
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
          </DialogHeader>
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
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

      {/* New File Dialog */}
      <Dialog open={newFileDialogOpen} onOpenChange={setNewFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New File</DialogTitle>
          </DialogHeader>
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="File name (e.g. document.txt)"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {selectedItem?.type === "file" ? "File" : "Folder"}</DialogTitle>
          </DialogHeader>
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={selectedItem?.type === "file" ? "File name" : "Folder name"}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
