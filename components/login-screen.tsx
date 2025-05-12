"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
    >
      <div className="w-80 rounded-lg bg-gray-800/80 p-6 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">TalOS</h1>
          <p className="text-gray-300">Please login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 text-white"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-blue-300 hover:text-blue-200"
          >
            {showHint ? "Hide hint" : "Need a hint?"}
          </button>

          {showHint && (
            <p className="mt-2 text-xs text-gray-300">
              Check the yellow post-it note on the screen border for login credentials.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
