import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "@radix-ui/react-label"
import { useAuth } from "@/contexts/authContext"
import { Zap, Mail, Lock, ArrowRight } from "lucide-react"
import { FcGoogle } from 'react-icons/fc'
import { loginWithGoogle } from "@/services/authService"
import axios from "axios"

const API = import.meta.env.VITE_API_BASE_URL

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const resp = await login(email, password)
      localStorage.setItem("userUid", resp.uid)
      localStorage.setItem("name", resp.displayName)
      navigate("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSigninWithGoogle = async () => {
    try {
      const resp = await loginWithGoogle()
      console.log(resp)
      localStorage.setItem("userUid", resp.uid)
      localStorage.setItem("name", resp.displayName)
      const isExists = await axios.get(`${API}/user/get/${localStorage.getItem("userUid")}`)
        .then((res) => {
          console.log(true)
        })
        .catch(async (e) => {
          console.log(false)
          const addUser = await axios.post(`${API}/user/add`, { name: resp.displayName, email: resp.email, firebaseId: resp.uid })
          .then(res => console.log("user added!"));
        })
      navigate("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Interview.io</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              type="button"
              onClick={handleSigninWithGoogle}
              variant="outline"
              className="w-full"
            >
              <FcGoogle /> Sign in with Google
            </Button>


          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>

        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:block relative bg-gradient-to-br from-primary/10 via-primary/5 to-background">

        <div className="absolute inset-0 flex items-center justify-center p-16 text-center">
          <div>
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 mb-6">
              <Zap className="h-12 w-12 text-primary" />
            </div>

            <h2 className="text-2xl font-bold mb-4">Ace Your Interviews</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Practice with AI-powered questions, take quizzes, and join virtual interview rooms to prepare for your dream job.
            </p>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      </div>
    </div>
  )
}
