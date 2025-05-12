"use client"

import { useState, useEffect } from "react"

export default function BootScreen() {
  const [bootStage, setBootStage] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing system...")
  const [loadingDots, setLoadingDots] = useState("")
  const [floppyInserted, setFloppyInserted] = useState(false)
  const [floppyPosition, setFloppyPosition] = useState(0)
  const [showReadIndicator, setShowReadIndicator] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Boot sequence animation
  useEffect(() => {
    const bootSequence = [
      { stage: 0, text: "Initializing system...", delay: 800 },
      { stage: 1, text: "Checking hardware...", delay: 800 },
      { stage: 2, text: "Insert system disk", delay: 1000 },
      { stage: 3, text: "Reading boot sector", delay: 800 },
      { stage: 4, text: "Loading kernel", delay: 800 },
      { stage: 5, text: "Starting TalOS v1.0", delay: 800 },
    ]

    let currentStage = 0

    const bootTimer = setInterval(() => {
      if (currentStage < bootSequence.length) {
        const { stage, text, delay } = bootSequence[currentStage]
        setBootStage(stage)
        setLoadingText(text)

        // Insert floppy animation at stage 2
        if (stage === 2) {
          // Start floppy insertion animation
          const insertionAnimation = setInterval(() => {
            setFloppyPosition((prev) => {
              if (prev >= 100) {
                clearInterval(insertionAnimation)
                setFloppyInserted(true)
                return 100
              }
              return prev + 5
            })
          }, 50)
        }

        // Show read indicator after floppy is inserted
        if (stage === 3) {
          setShowReadIndicator(true)

          // Start progress bar animation
          const progressAnimation = setInterval(() => {
            setLoadingProgress((prev) => {
              if (prev >= 100) {
                clearInterval(progressAnimation)
                return 100
              }
              return prev + 2
            })
          }, 50)
        }

        currentStage++
      }
    }, 1000)

    // Animate loading dots
    const dotsTimer = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 300)

    return () => {
      clearInterval(bootTimer)
      clearInterval(dotsTimer)
    }
  }, [])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black text-green-500 font-mono">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">TalOS</h1>
          <p className="text-sm text-green-400">Version 1.0</p>
        </div>

        {/* Boot messages */}
        <div className="mb-8 h-40 overflow-hidden border border-green-800 bg-black p-4 font-mono text-sm">
          <div className="space-y-1">
            {bootStage >= 0 && <p>{">"} Initializing system...</p>}
            {bootStage >= 1 && <p>{">"} Checking hardware... OK</p>}
            {bootStage >= 2 && <p>{">"} Insert system disk</p>}
            {bootStage >= 3 && <p>{">"} Reading boot sector... OK</p>}
            {bootStage >= 4 && <p>{">"} Loading kernel... OK</p>}
            {bootStage >= 5 && <p>{">"} Starting TalOS v1.0</p>}
            <p className="animate-pulse">
              {loadingText}
              {loadingDots}
            </p>
          </div>
        </div>

        {/* Floppy disk animation */}
        <div className="relative mx-auto mb-4 h-40 w-64">

          {/* Floppy disk */}
          <div
            className="absolute left-0 h-32 w-44 bg-gray-800 border border-gray-700 transition-all duration-500"
            style={{
              transform: `translateX(${floppyPosition}%)`,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {/* Floppy disk label */}
            <div className="absolute left-4 top-4 h-16 w-36 bg-blue-900 border border-gray-600 flex items-center justify-center">
              <span className="text-xs text-white">TalOS System Disk</span>
            </div>

            {/* Metal slider */}
            <div className="absolute bottom-4 left-1/2 h-4 w-24 -translate-x-1/2 bg-gray-600"></div>

            {/* Center hole */}
            <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-600 bg-black"></div>
          </div>
        </div>

        {/* Progress bar */}
        {bootStage >= 3 && (
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-900 border border-green-800">
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}
