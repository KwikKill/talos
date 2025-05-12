"use client"

import { useState, useEffect } from "react"
import LoginScreen from "@/components/login-screen"
import Desktop from "@/components/desktop"
import PostIt from "@/components/post-it"
import { Toaster } from "@/components/ui/toaster"
import BootScreen from "@/components/boot-screen"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate OS boot time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 8000) // Longer boot time to enjoy the animation
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (username: string, password: string) => {
    // Check credentials against the ones on the post-it
    if (username === "admin" && password === "password123") {
      setIsLoggedIn(true)
    } else {
      alert("Invalid credentials. Check the post-it note for help!")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-800 p-6">
      <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-lime-900 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="bggrid absolute left-0 top-0 grid size-full grid-cols-12 grid-rows-12 gap-4">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="rounded-md bg-white" />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative h-full w-full max-w-6xl overflow-hidden rounded-xl bg-black p-8 shadow-2xl">
        {/* Computer screen bezel */}
        <div className="absolute inset-0 rounded-xl border-8 border-gray-800 shadow-inner"></div>

        {/* Post-it note */}
        <PostIt username="admin" password="password123" />

        {/* Screen content */}
        <div className="screen relative h-full w-full overflow-hidden rounded-md bg-blue-900">
          {isLoading ? <BootScreen /> : isLoggedIn ? <Desktop onLogout={handleLogout}/> : <LoginScreen onLogin={handleLogin} />}
          <Toaster />
        </div>
      </div>
    </div>
  )
}
