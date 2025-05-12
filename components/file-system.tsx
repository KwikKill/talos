"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

// Define file system types
export interface FSFile {
  id: string
  name: string
  content: string
  type: string
  createdAt: Date
  updatedAt: Date
  parentId: string | null
}

export interface FSFolder {
  id: string
  name: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

interface FileSystemContextType {
  files: FSFile[]
  folders: FSFolder[]
  currentFolder: string | null
  createFile: (name: string, content: string, type: string, parentId: string | null) => FSFile
  createFolder: (name: string, parentId: string | null) => FSFolder
  updateFile: (id: string, content: string) => void
  deleteFile: (id: string) => void
  deleteFolder: (id: string) => void
  navigateToFolder: (folderId: string | null) => void
  getCurrentPath: () => string
  getFileById: (id: string) => FSFile | undefined
  getFolderById: (id: string) => FSFolder | undefined
  getFilesInFolder: (folderId: string | null) => FSFile[]
  getFoldersInFolder: (folderId: string | null) => FSFolder[]
  renameFile: (id: string, newName: string) => void
  renameFolder: (id: string, newName: string) => void
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FSFile[]>(() => {
    if (typeof window !== "undefined") {
      const savedFiles = localStorage.getItem("fs_files")
      return savedFiles ? JSON.parse(savedFiles) : initialFiles
    }
    return initialFiles
  })

  const [folders, setFolders] = useState<FSFolder[]>(() => {
    if (typeof window !== "undefined") {
      const savedFolders = localStorage.getItem("fs_folders")
      return savedFolders ? JSON.parse(savedFolders) : initialFolders
    }
    return initialFolders
  })

  const [currentFolder, setCurrentFolder] = useState<string | null>(null)

  // Save to localStorage whenever files or folders change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fs_files", JSON.stringify(files))
      localStorage.setItem("fs_folders", JSON.stringify(folders))
    }
  }, [files, folders])

  const createFile = (name: string, content: string, type: string, parentId: string | null): FSFile => {
    const newFile: FSFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      content,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId,
    }
    setFiles((prev) => [...prev, newFile])
    return newFile
  }

  const createFolder = (name: string, parentId: string | null): FSFolder => {
    const newFolder: FSFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setFolders((prev) => [...prev, newFolder])
    return newFolder
  }

  const updateFile = (id: string, content: string) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, content, updatedAt: new Date() } : file)))
  }

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const deleteFolder = (id: string) => {
    // Delete the folder
    setFolders((prev) => prev.filter((folder) => folder.id !== id))

    // Delete all files in the folder
    setFiles((prev) => prev.filter((file) => file.parentId !== id))

    // Delete all subfolders recursively
    const subfolders = folders.filter((folder) => folder.parentId === id)
    subfolders.forEach((subfolder) => deleteFolder(subfolder.id))
  }

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId)
  }

  const getCurrentPath = (): string => {
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

  const getFileById = (id: string): FSFile | undefined => {
    return files.find((file) => file.id === id)
  }

  const getFolderById = (id: string): FSFolder | undefined => {
    return folders.find((folder) => folder.id === id)
  }

  const getFilesInFolder = (folderId: string | null): FSFile[] => {
    return files.filter((file) => file.parentId === folderId)
  }

  const getFoldersInFolder = (folderId: string | null): FSFolder[] => {
    return folders.filter((folder) => folder.parentId === folderId)
  }

  const renameFile = (id: string, newName: string) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, name: newName, updatedAt: new Date() } : file)))
  }

  const renameFolder = (id: string, newName: string) => {
    setFolders((prev) =>
      prev.map((folder) => (folder.id === id ? { ...folder, name: newName, updatedAt: new Date() } : folder)),
    )
  }

  return (
    <FileSystemContext.Provider
      value={{
        files,
        folders,
        currentFolder,
        createFile,
        createFolder,
        updateFile,
        deleteFile,
        deleteFolder,
        navigateToFolder,
        getCurrentPath,
        getFileById,
        getFolderById,
        getFilesInFolder,
        getFoldersInFolder,
        renameFile,
        renameFolder,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  )
}

export function useFileSystem() {
  const context = useContext(FileSystemContext)
  if (context === undefined) {
    throw new Error("useFileSystem must be used within a FileSystemProvider")
  }
  return context
}

// Initial file system data
const initialFolders: FSFolder[] = [
  {
    id: "folder-documents",
    name: "Documents",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "folder-pictures",
    name: "Pictures",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "folder-downloads",
    name: "Downloads",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const initialFiles: FSFile[] = [
  {
    id: "file-readme",
    name: "README.txt",
    content: "Welcome to ReactOS!\n\nThis is a simulated operating system built with React and Next.js.",
    type: "txt",
    createdAt: new Date(),
    updatedAt: new Date(),
    parentId: null,
  },
  {
    id: "file-todo",
    name: "todo.txt",
    content: "1. Learn React\n2. Build an OS simulation\n3. ???\n4. Profit!",
    type: "txt",
    createdAt: new Date(),
    updatedAt: new Date(),
    parentId: "folder-documents",
  },
]
