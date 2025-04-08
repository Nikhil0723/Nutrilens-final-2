"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  email: string
  name?: string
  isOnboarded: boolean
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  logout: () => void
  completeOnboarding: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy users for testing
const DUMMY_USERS = [
  { email: "user@example.com", password: "password", isOnboarded: true },
  { email: "new@example.com", password: "password", isOnboarded: false },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    // Simulate API call
    const foundUser = DUMMY_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = {
        email: foundUser.email,
        isOnboarded: foundUser.isOnboarded,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    }
    return false
  }

  // Signup function
  const signup = async (email: string, password: string) => {
    // In a real app, you would call an API to create a user
    // For this demo, we'll just simulate success
    const userData = {
      email,
      isOnboarded: false,
    }
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    return true
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Complete onboarding
  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, isOnboarded: true }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, completeOnboarding }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

