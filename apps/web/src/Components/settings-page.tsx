// src/Components/pages/settings-page.tsx
"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"

export function SettingsPage() {
  const { setTheme, theme } = useTheme()
  const [notifications, setNotifications] = useState({
    newMessages: true,
    accountActivity: false,
    applicationUpdates: true,
  })

  return (
    <div className="space-y-6 p-4 md:p-10">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-switcher">
              <h3 className="text-lg font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">
                Select a light or dark theme for the application.
              </p>
            </Label>
            <Button
              id="theme-switcher"
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
              <Moon className="hidden h-5 w-5 dark:block" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="new-messages-switch">
              <h3 className="text-lg font-medium">New Messages</h3>
              <p className="text-sm text-muted-foreground">
                Receive notifications for new messages.
              </p>
            </Label>
            <Switch
              id="new-messages-switch"
              checked={notifications.newMessages}
              onCheckedChange={() =>
                setNotifications((prev) => ({
                  ...prev,
                  newMessages: !prev.newMessages,
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="account-activity-switch">
              <h3 className="text-lg font-medium">Account Activity</h3>
              <p className="text-sm text-muted-foreground">
                Get notified about activity related to your account.
              </p>
            </Label>
            <Switch
              id="account-activity-switch"
              checked={notifications.accountActivity}
              onCheckedChange={() =>
                setNotifications((prev) => ({
                  ...prev,
                  accountActivity: !prev.accountActivity,
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="application-updates-switch">
              <h3 className="text-lg font-medium">Application Updates</h3>
              <p className="text-sm text-muted-foreground">
                Receive notifications about new features and updates.
              </p>
            </Label>
            <Switch
              id="application-updates-switch"
              checked={notifications.applicationUpdates}
              onCheckedChange={() =>
                setNotifications((prev) => ({
                  ...prev,
                  applicationUpdates: !prev.applicationUpdates,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}