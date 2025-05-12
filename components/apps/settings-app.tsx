"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Monitor, Moon, Sun, Volume2, Wifi, ImageIcon } from "lucide-react"
import { useSystemSettings } from "@/components/system-settings-context"
import { useToast } from "@/hooks/use-toast"

// Define wallpaper options
const wallpapers = [
  { id: "default", url: "/placeholder.svg?height=1080&width=1920", name: "Default" },
  { id: "blue", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", name: "Blue Gradient" },
  { id: "mountain", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", name: "Mountain" },
  { id: "forest", url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d", name: "Forest" },
  { id: "beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", name: "Beach" },
]

export default function SettingsApp() {
  const { settings, updateSettings } = useSystemSettings()
  const { toast } = useToast()

  // Local state for form values
  const [darkMode, setDarkMode] = useState(settings.darkMode)
  const [volume, setVolume] = useState(settings.volume)
  const [wifi, setWifi] = useState(true)
  const [brightness, setBrightness] = useState(settings.brightness)
  const [selectedWallpaper, setSelectedWallpaper] = useState(settings.wallpaper)
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState("")

  // Update local state when settings change
  useEffect(() => {
    setDarkMode(settings.darkMode)
    setVolume(settings.volume)
    setBrightness(settings.brightness)
    setSelectedWallpaper(settings.wallpaper)
  }, [settings])

  // Apply settings immediately
  const applySettings = () => {
    updateSettings({
      darkMode,
      volume,
      brightness,
      wallpaper: selectedWallpaper,
    })

    toast({
      title: "Settings updated",
      description: "Your changes have been applied successfully.",
      duration: 3000,
    })
  }

  const handleWallpaperSelect = (wallpaperUrl: string) => {
    setSelectedWallpaper(wallpaperUrl)
  }

  const handleCustomWallpaper = () => {
    if (customWallpaperUrl.trim()) {
      setSelectedWallpaper(customWallpaperUrl)
    }
  }

  return (
    <div className="h-full overflow-auto p-4 bg-background text-foreground">
      <h2 className="mb-6 text-2xl font-bold">Settings</h2>

      <Tabs defaultValue="display">
        <TabsList className="mb-4">
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="sound">Sound</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="display" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon className="h-5 w-5" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <Label>Brightness</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[brightness]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(value) => setBrightness(value[0])}
                  className="flex-1"
                />
                <Sun className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <Label>Wallpaper</Label>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {wallpapers.map((wallpaper) => (
                  <div
                    key={wallpaper.id}
                    className={`relative cursor-pointer overflow-hidden rounded-md border-2 ${
                      selectedWallpaper === wallpaper.url ? "border-blue-500" : "border-transparent"
                    }`}
                    onClick={() => handleWallpaperSelect(wallpaper.url)}
                  >
                    <img
                      src={wallpaper.url || "/placeholder.svg"}
                      alt={wallpaper.name}
                      className="h-20 w-full object-cover"
                    />
                    <div className="absolute bottom-0 w-full bg-black bg-opacity-50 p-1 text-center text-xs text-white">
                      {wallpaper.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Custom wallpaper URL"
                  value={customWallpaperUrl}
                  onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                />
                <Button onClick={handleCustomWallpaper}>Set</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sound" className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <Label>Volume</Label>
            </div>
            <Slider value={[volume]} min={0} max={100} step={1} onValueChange={(value) => setVolume(value[0])} />
            <div className="text-right text-sm text-muted-foreground">{volume}%</div>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <Label htmlFor="wifi">Wi-Fi</Label>
            </div>
            <Switch id="wifi" checked={wifi} onCheckedChange={setWifi} />
          </div>

          {wifi && (
            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Available Networks</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div>Home Network</div>
                    <div className="text-xs text-muted-foreground">Connected</div>
                  </div>
                  <div className="text-green-500">●</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Guest Network</div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>Office Network</div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <div>
            <h3 className="mb-2 font-medium">System Information</h3>
            <div className="rounded-md border p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">OS Name:</div>
                <div>TalOS</div>
                <div className="text-muted-foreground">Version:</div>
                <div>1.0.0</div>
                <div className="text-muted-foreground">Build:</div>
                <div>2023.05.11</div>
                <div className="text-muted-foreground">Device:</div>
                <div>Virtual Machine</div>
                <div className="text-muted-foreground">Processor:</div>
                <div>React Virtual CPU</div>
                <div className="text-muted-foreground">Memory:</div>
                <div>4 GB</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={applySettings}>Apply Settings</Button>
      </div>
    </div>
  )
}
