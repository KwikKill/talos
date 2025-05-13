"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useFileSystem } from "@/components/file-system"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface CommandOutput {
  text: string
  isError?: boolean
  isCommand?: boolean
  isHTML?: boolean
}

// Add a new prop to the CmdAppProps interface to allow the app to close its own window
interface CmdAppProps {
  onOpenFile?: (fileId: string, appId: string) => void
  onClose?: () => void
}

export default function CmdApp({ onOpenFile, onClose }: CmdAppProps) {
  const {
    files,
    folders,
    currentFolder: fsCurrentFolder,
    navigateToFolder,
    getFileById,
    getFolderById,
    getFilesInFolder,
    getFoldersInFolder,
    createFile,
    createFolder,
    updateFile,
    deleteFile,
    deleteFolder,
    getCurrentPath,
  } = useFileSystem()

  const [currentFolder, setCurrentFolder] = useState<string | null>(fsCurrentFolder)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandOutput, setCommandOutput] = useState<CommandOutput[]>([
    { text: "TalOS Command Line Interface v1.0" },
    { text: "Type 'help' to see available commands." },
    { text: "" },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const [username] = useState("admin")
  const [hostname] = useState("talos")
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Sync with file system current folder
  useEffect(() => {
    navigateToFolder(currentFolder)
  }, [currentFolder, navigateToFolder])

  // Auto-focus input and scroll to bottom on new output
  useEffect(() => {
    inputRef.current?.focus()
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [commandOutput])

  // Handle command execution
  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return

    // Add command to history
    setCommandHistory((prev) => [...prev, cmd])
    setHistoryIndex(-1)

    // Add command to output
    setCommandOutput((prev) => [
      ...prev,
      { text: `${username}@${hostname}:${getCurrentPath()}$ ${cmd}`, isCommand: true },
    ])

    // Parse command and arguments
    const args = cmd.trim().split(/\s+/)
    const command = args[0].toLowerCase()
    const commandArgs = args.slice(1)

    // Execute command
    switch (command) {
      case "help":
        handleHelp(commandArgs[0])
        break
      case "ls":
      case "ll":
        handleList(commandArgs[0], command === "ll")
        break
      case "cd":
        handleChangeDirectory(commandArgs[0])
        break
      case "pwd":
        handlePrintWorkingDirectory()
        break
      case "nano":
      case "edit":
        handleEditFile(commandArgs[0])
        break
      case "cat":
        handleCatFile(commandArgs[0])
        break
      case "rm":
        handleRemove(commandArgs[0], commandArgs.includes("-r") || commandArgs.includes("-rf"))
        break
      case "mkdir":
        handleMakeDirectory(commandArgs[0])
        break
      case "touch":
        handleTouch(commandArgs[0])
        break
      case "cp":
        handleCopy(commandArgs[0], commandArgs[1])
        break
      case "mv":
        handleMove(commandArgs[0], commandArgs[1])
        break
      case "clear":
        handleClear()
        break
      case "echo":
        handleEcho(commandArgs)
        break
      case "whoami":
        handleWhoAmI()
        break
      case "date":
        handleDate()
        break
      case "exit":
        handleExit()
        break
      default:
        setCommandOutput((prev) => [
          ...prev,
          { text: `Command not found: ${command}. Type 'help' for a list of commands.`, isError: true },
        ])
    }

    // Clear current command
    setCurrentCommand("")
  }

  // Command handlers
  const handleHelp = (command?: string) => {
    if (command) {
      // Show help for specific command
      const commandHelp = {
        help: "help [command] - Display help information for a specific command or list all commands",
        ls: "ls [path] - List files and directories in the specified path or current directory",
        ll: "ll [path] - List files and directories in the specified path or current directory with details",
        cd: "cd [path] - Change the current directory to the specified path",
        pwd: "pwd - Print the current working directory",
        nano: "nano [file] - Edit the specified file",
        edit: "edit [file] - Edit the specified file (alias for nano)",
        cat: "cat [file] - Display the contents of the specified file",
        rm: "rm [path] - Remove the specified file or directory. Use -r or -rf for directories",
        mkdir: "mkdir [directory] - Create a new directory",
        touch: "touch [file] - Create a new empty file",
        cp: "cp [source] [destination] - Copy a file or directory",
        mv: "mv [source] [destination] - Move a file or directory",
        clear: "clear - Clear the terminal screen",
        echo: "echo [text] - Display text on the terminal",
        whoami: "whoami - Display the current user",
        date: "date - Display the current date and time",
        exit: "exit - Close the terminal window",
      }[command.toLowerCase()]

      if (commandHelp) {
        setCommandOutput((prev) => [...prev, { text: commandHelp }])
      } else {
        setCommandOutput((prev) => [...prev, { text: `No help available for '${command}'`, isError: true }])
      }
    } else {
      // List all commands
      setCommandOutput((prev) => [
        ...prev,
        {
          text: "Available commands:",
        },
        {
          text: "help, ls, ll, cd, pwd, nano, edit, cat, rm, mkdir, touch, cp, mv, clear, echo, whoami, date, exit",
        },
        {
          text: "Type 'help [command]' for more information on a specific command.",
        },
      ])
    }
  }

  const handleList = (path?: string, detailed = false) => {
    let targetFolder = currentFolder

    if (path) {
      const resolvedPath = resolvePath(path)
      if (resolvedPath.type === "folder") {
        targetFolder = resolvedPath.id
      } else if (resolvedPath.type === "file") {
        setCommandOutput((prev) => [...prev, { text: path, isError: false }])
        return
      } else {
        setCommandOutput((prev) => [
          ...prev,
          { text: `ls: cannot access '${path}': No such file or directory`, isError: true },
        ])
        return
      }
    }

    const files = getFilesInFolder(targetFolder)
    const directories = getFoldersInFolder(targetFolder)

    if (files.length === 0 && directories.length === 0) {
      setCommandOutput((prev) => [...prev, { text: "" }])
      return
    }

    if (detailed) {
      // Detailed listing (ll)
      const output: string[] = []

      directories.forEach((dir) => {
        const date = new Date(dir.updatedAt).toLocaleString()
        output.push(`drwxr-xr-x  ${username}  ${date}  ${dir.name}/`)
      })

      files.forEach((file) => {
        const date = new Date(file.updatedAt).toLocaleString()
        const size = file.content.length
        output.push(`-rw-r--r--  ${username}  ${date}  ${size}B  ${file.name}`)
      })

      setCommandOutput((prev) => [...prev, { text: output.join("\n") }])
    } else {
      // Simple listing (ls)
      const dirNames = directories.map((dir) => `<span class="text-blue-500">${dir.name}/</span>`)
      const fileNames = files.map((file) => {
        // Color based on file type
        let colorClass = "text-white"
        if (file.type === "txt") colorClass = "text-green-500"
        else if (file.type === "js" || file.type === "jsx" || file.type === "ts" || file.type === "tsx")
          colorClass = "text-yellow-500"
        else if (file.type === "json") colorClass = "text-purple-500"
        else if (file.type === "md") colorClass = "text-blue-300"
        else if (file.type === "css") colorClass = "text-pink-500"
        else if (file.type === "html") colorClass = "text-orange-500"

        return `<span class="${colorClass}">${file.name}</span>`
      })

      const allItems = [...dirNames, ...fileNames]
      setCommandOutput((prev) => [...prev, { text: allItems.join("  "), isHTML: true }])
    }
  }

  const handleChangeDirectory = (path?: string) => {
    if (!path || path === "~") {
      // Go to root
      setCurrentFolder(null)
      return
    }

    if (path === "..") {
      // Go up one level
      const parentFolder = currentFolder ? getFolderById(currentFolder)?.parentId : null
      setCurrentFolder(parentFolder ?? null)
      return
    }

    // Resolve path
    const resolvedPath = resolvePath(path)
    if (resolvedPath.type === "folder") {
      setCurrentFolder(resolvedPath.id)
    } else if (resolvedPath.type === "file") {
      setCommandOutput((prev) => [...prev, { text: `cd: not a directory: ${path}`, isError: true }])
    } else {
      setCommandOutput((prev) => [...prev, { text: `cd: no such file or directory: ${path}`, isError: true }])
    }
  }

  const handlePrintWorkingDirectory = () => {
    setCommandOutput((prev) => [...prev, { text: getCurrentPath() }])
  }

  const handleEditFile = (path?: string) => {
    if (!path) {
      setCommandOutput((prev) => [...prev, { text: "nano: missing file operand", isError: true }])
      return
    }

    const resolvedPath = resolvePath(path)
    if (resolvedPath.type === "file") {
      // Open file in notepad
      toast({
        title: "Opening file in Notepad",
        description: `Opening ${path} in Notepad...`,
      })
      if (onOpenFile) {
        onOpenFile(resolvedPath.id, "notepad")
      }
    } else if (resolvedPath.type === "folder") {
      setCommandOutput((prev) => [...prev, { text: `nano: ${path} is a directory`, isError: true }])
    } else {
      // Create new file
      const fileName = path.split("/").pop() || path
      const parentPath = path.includes("/") ? path.substring(0, path.lastIndexOf("/")) : ""

      let parentFolder = currentFolder
      if (parentPath) {
        const resolvedParent = resolvePath(parentPath)
        if (resolvedParent.type === "folder") {
          parentFolder = resolvedParent.id
        } else {
          setCommandOutput((prev) => [
            ...prev,
            { text: `nano: cannot create file '${path}': No such directory`, isError: true },
          ])
          return
        }
      }

      const extension = fileName.includes(".") ? fileName.split(".").pop() || "txt" : "txt"
      createFile(fileName, "", extension, parentFolder)
      toast({
        title: "File created",
        description: `Created and opening ${fileName} in Notepad...`,
      })
    }
  }

  const handleCatFile = (path?: string) => {
    if (!path) {
      setCommandOutput((prev) => [...prev, { text: "cat: missing file operand", isError: true }])
      return
    }

    const resolvedPath = resolvePath(path)
    if (resolvedPath.type === "file") {
      const file = getFileById(resolvedPath.id)
      if (file) {
        setCommandOutput((prev) => [...prev, { text: file.content || "(empty file)" }])
      }
    } else if (resolvedPath.type === "folder") {
      setCommandOutput((prev) => [...prev, { text: `cat: ${path}: Is a directory`, isError: true }])
    } else {
      setCommandOutput((prev) => [...prev, { text: `cat: ${path}: No such file or directory`, isError: true }])
    }
  }

  const handleRemove = (path?: string, recursive = false) => {
    if (!path) {
      setCommandOutput((prev) => [...prev, { text: "rm: missing operand", isError: true }])
      return
    }

    const resolvedPath = resolvePath(path)
    if (resolvedPath.type === "file") {
      deleteFile(resolvedPath.id)
      setCommandOutput((prev) => [...prev, { text: `Removed file: ${path}` }])
    } else if (resolvedPath.type === "folder") {
      if (recursive) {
        deleteFolder(resolvedPath.id)
        setCommandOutput((prev) => [...prev, { text: `Removed directory: ${path}` }])
      } else {
        setCommandOutput((prev) => [
          ...prev,
          { text: `rm: cannot remove '${path}': Is a directory. Use -r flag for directories.`, isError: true },
        ])
      }
    } else {
      setCommandOutput((prev) => [
        ...prev,
        { text: `rm: cannot remove '${path}': No such file or directory`, isError: true },
      ])
    }
  }

  const handleMakeDirectory = (path?: string) => {
    if (!path) {
      setCommandOutput((prev) => [...prev, { text: "mkdir: missing operand", isError: true }])
      return
    }

    // Check if directory already exists
    const resolvedPath = resolvePath(path)
    if (resolvedPath.type !== "notfound") {
      setCommandOutput((prev) => [
        ...prev,
        { text: `mkdir: cannot create directory '${path}': File exists`, isError: true },
      ])
      return
    }

    // Create directory
    const dirName = path.split("/").pop() || path
    const parentPath = path.includes("/") ? path.substring(0, path.lastIndexOf("/")) : ""

    let parentFolder = currentFolder
    if (parentPath) {
      const resolvedParent = resolvePath(parentPath)
      if (resolvedParent.type === "folder") {
        parentFolder = resolvedParent.id
      } else {
        setCommandOutput((prev) => [
          ...prev,
          { text: `mkdir: cannot create directory '${path}': No such file or directory`, isError: true },
        ])
        return
      }
    }

    createFolder(dirName, parentFolder)
    setCommandOutput((prev) => [...prev, { text: `Created directory: ${path}` }])
  }

  const handleTouch = (path?: string) => {
    if (!path) {
      setCommandOutput((prev) => [...prev, { text: "touch: missing file operand", isError: true }])
      return
    }

    // Check if file already exists
    const resolvedPath = resolvePath(path)
    if (resolvedPath.type === "file") {
      // Update file timestamp
      const file = getFileById(resolvedPath.id)
      if (file) {
        updateFile(file.id, file.content)
        setCommandOutput((prev) => [...prev, { text: `Updated timestamp: ${path}` }])
      }
      return
    } else if (resolvedPath.type === "folder") {
      setCommandOutput((prev) => [...prev, { text: `touch: cannot touch '${path}': Is a directory`, isError: true }])
      return
    }

    // Create new file
    const fileName = path.split("/").pop() || path
    const parentPath = path.includes("/") ? path.substring(0, path.lastIndexOf("/")) : ""

    let parentFolder = currentFolder
    if (parentPath) {
      const resolvedParent = resolvePath(parentPath)
      if (resolvedParent.type === "folder") {
        parentFolder = resolvedParent.id
      } else {
        setCommandOutput((prev) => [
          ...prev,
          { text: `touch: cannot touch '${path}': No such file or directory`, isError: true },
        ])
        return
      }
    }

    const extension = fileName.includes(".") ? fileName.split(".").pop() || "txt" : "txt"
    createFile(fileName, "", extension, parentFolder)
    setCommandOutput((prev) => [...prev, { text: `Created file: ${path}` }])
  }

  const handleCopy = (source?: string, destination?: string) => {
    if (!source || !destination) {
      setCommandOutput((prev) => [
        ...prev,
        { text: "cp: missing file operand", isError: true },
        { text: "Usage: cp [source] [destination]", isError: true },
      ])
      return
    }

    const resolvedSource = resolvePath(source)
    if (resolvedSource.type === "notfound") {
      setCommandOutput((prev) => [
        ...prev,
        { text: `cp: cannot stat '${source}': No such file or directory`, isError: true },
      ])
      return
    }

    if (resolvedSource.type === "file") {
      const sourceFile = getFileById(resolvedSource.id)
      if (!sourceFile) {
        setCommandOutput((prev) => [
          ...prev,
          { text: `cp: cannot stat '${source}': No such file or directory`, isError: true },
        ])
        return
      }

      // Determine destination
      const resolvedDest = resolvePath(destination)
      if (resolvedDest.type === "folder") {
        // Copy to folder with same name
        const fileName = source.split("/").pop() || source
        createFile(fileName, sourceFile.content, sourceFile.type, resolvedDest.id)
        setCommandOutput((prev) => [...prev, { text: `Copied file: ${source} -> ${destination}/${fileName}` }])
      } else if (resolvedDest.type === "file") {
        // Overwrite existing file
        const destFile = getFileById(resolvedDest.id)
        if (destFile) {
          updateFile(destFile.id, sourceFile.content)
          setCommandOutput((prev) => [...prev, { text: `Copied file: ${source} -> ${destination} (overwritten)` }])
        }
      } else {
        // Create new file
        const fileName = destination.split("/").pop() || destination
        const parentPath = destination.includes("/") ? destination.substring(0, destination.lastIndexOf("/")) : ""

        let parentFolder = currentFolder
        if (parentPath) {
          const resolvedParent = resolvePath(parentPath)
          if (resolvedParent.type === "folder") {
            parentFolder = resolvedParent.id
          } else {
            setCommandOutput((prev) => [
              ...prev,
              { text: `cp: cannot create file '${destination}': No such directory`, isError: true },
            ])
            return
          }
        }

        const extension = fileName.includes(".") ? fileName.split(".").pop() || sourceFile.type : sourceFile.type
        createFile(fileName, sourceFile.content, extension, parentFolder)
        setCommandOutput((prev) => [...prev, { text: `Copied file: ${source} -> ${destination}` }])
      }
    } else if (resolvedSource.type === "folder") {
      setCommandOutput((prev) => [
        ...prev,
        { text: `cp: omitting directory '${source}'. Directory copying not implemented.`, isError: true },
      ])
    }
  }

  const handleMove = (source?: string, destination?: string) => {
    if (!source || !destination) {
      setCommandOutput((prev) => [
        ...prev,
        { text: "mv: missing file operand", isError: true },
        { text: "Usage: mv [source] [destination]", isError: true },
      ])
      return
    }

    // First copy the file
    handleCopy(source, destination)

    // Then delete the original
    const resolvedSource = resolvePath(source)
    if (resolvedSource.type === "file") {
      deleteFile(resolvedSource.id)
    } else if (resolvedSource.type === "folder") {
      setCommandOutput((prev) => [
        ...prev,
        { text: `mv: omitting directory '${source}'. Directory moving not implemented.`, isError: true },
      ])
      return
    }
  }

  const handleClear = () => {
    setCommandOutput([])
  }

  const handleEcho = (args: string[]) => {
    setCommandOutput((prev) => [...prev, { text: args.join(" ") }])
  }

  const handleWhoAmI = () => {
    setCommandOutput((prev) => [...prev, { text: username }])
  }

  const handleDate = () => {
    setCommandOutput((prev) => [...prev, { text: new Date().toString() }])
  }

  // Add the handleExit function after the other command handlers
  const handleExit = () => {
    setCommandOutput((prev) => [...prev, { text: "Exiting terminal..." }])

    // Close the window after a short delay to show the exit message
    setTimeout(() => {
      if (onClose) {
        onClose()
      }
    }, 500)
  }

  // Helper function to resolve paths
  const resolvePath = (path: string): { type: "file" | "folder" | "notfound"; id: string } => {
    // Handle absolute paths
    let targetFolder = currentFolder
    if (path.startsWith("/") || path.startsWith("C:\\")) {
      targetFolder = null // Start from root
      path = path.replace(/^\/|^C:\\/, "") // Remove leading / or C:\
    } else if (path.startsWith("~/") || path.startsWith("~\\")) {
      targetFolder = null // Start from root
      path = path.replace(/^~\/|^~\\/, "") // Remove leading ~/ or ~\\
    }

    // Handle empty path
    if (!path) {
      return { type: "folder", id: targetFolder || "root" }
    }

    // Split path into components
    const components = path.split(/\/|\\/).filter(Boolean)

    // Navigate through path components
    for (let i = 0; i < components.length; i++) {
      const component = components[i]

      if (component === "..") {
        // Go up one level
        if (targetFolder) {
          const folder = getFolderById(targetFolder)
          targetFolder = folder?.parentId || null
        }
        continue
      }

      if (component === ".") {
        // Stay in current folder
        continue
      }

      // Check if this is the last component
      const isLastComponent = i === components.length - 1

      // Look for matching folder or file
      const matchingFolder = getFoldersInFolder(targetFolder).find((f) => f.name === component)
      if (matchingFolder) {
        targetFolder = matchingFolder.id
        continue
      }

      // If this is the last component, check if it's a file
      if (isLastComponent) {
        const matchingFile = getFilesInFolder(targetFolder).find((f) => f.name === component)
        if (matchingFile) {
          return { type: "file", id: matchingFile.id }
        }
      }

      // If we get here, the path component wasn't found
      return { type: "notfound", id: "" }
    }

    // If we get here, the path resolved to a folder
    return { type: "folder", id: targetFolder || "root" }
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      // Navigate up through command history
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      // Navigate down through command history
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentCommand("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Auto-complete
      if (currentCommand.trim()) {
        const args = currentCommand.trim().split(/\s+/)
        if (args.length <= 1) {
          // Auto-complete command
          const commands = [
            "help",
            "ls",
            "ll",
            "cd",
            "pwd",
            "nano",
            "edit",
            "cat",
            "rm",
            "mkdir",
            "touch",
            "cp",
            "mv",
            "clear",
            "echo",
            "whoami",
            "date",
            "exit",
          ]
          const matchingCommands = commands.filter((cmd) => cmd.startsWith(args[0]))
          if (matchingCommands.length === 1) {
            setCurrentCommand(matchingCommands[0])
          }
        } else {
          // Auto-complete path
          const lastArg = args[args.length - 1]
          const pathPrefix = lastArg.split(/\/|\\/).slice(0, -1).join("/")
          const lastComponent = lastArg.split(/\/|\\/).pop() || ""

          let targetFolder = currentFolder
          if (pathPrefix) {
            const resolvedPath = resolvePath(pathPrefix)
            if (resolvedPath.type === "folder") {
              targetFolder = resolvedPath.id
            } else {
              return
            }
          }

          // Get matching files and folders
          const matchingFolders = getFoldersInFolder(targetFolder)
            .filter((f) => f.name.startsWith(lastComponent))
            .map((f) => f.name)
          const matchingFiles = getFilesInFolder(targetFolder)
            .filter((f) => f.name.startsWith(lastComponent))
            .map((f) => f.name)

          const matches = [...matchingFolders, ...matchingFiles]
          if (matches.length === 1) {
            // Single match - auto-complete
            const newArgs = [...args]
            newArgs[newArgs.length - 1] = pathPrefix ? `${pathPrefix}/${matches[0]}` : matches[0]
            setCurrentCommand(newArgs.join(" "))
          } else if (matches.length > 1) {
            // Multiple matches - show options
            setCommandOutput((prev) => [
              ...prev,
              { text: `${username}@${hostname}:${getCurrentPath()}$ ${currentCommand}`, isCommand: true },
              { text: matches.join("  ") },
            ])
          }
        }
      }
    }
  }

  return (
    <div className="flex h-full flex-col bg-black text-white font-mono p-2">
      <ScrollArea className="flex-1 h-full" ref={scrollAreaRef}>
        <div className="p-2">
          {commandOutput.map((output, index) => (
            <div
              key={index}
              className={`whitespace-pre-wrap mb-1 ${output.isError ? "text-red-500" : ""} ${
                output.isCommand ? "text-green-400" : ""
              }`}
            >
              {output.isHTML ? <div dangerouslySetInnerHTML={{ __html: output.text }} /> : output.text}
            </div>
          ))}
          <div className="flex items-center">
            <span className="text-green-400 mr-2">
              {username}@{hostname}:{getCurrentPath()}$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none border-none"
              autoFocus
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
