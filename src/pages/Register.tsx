import type React from "react"

import { useState } from "react"

import { Button } from "../components/ui/button"
import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { ChevronLeft, Eye, EyeOff, Loader2, User, Lock ,IdCard} from "lucide-react"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Link, useNavigate } from "react-router"
import { register } from "../services/user"

export default function Register() {
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
    confirm_password:""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword,setConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if(name === "confirm_password"){
        if(formData.password !== value){
            setError("Passwords not match!!")
        }else{
            setError("")
        }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)


  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
     setError("")
 
     // Basic validation
     if (!formData.email.trim() || !formData.password.trim()) {
       setError("Please fill in all fields")
       return
     }
 
     setIsLoading(true)
 
     try {
       const response = await register(formData.email,formData.password,formData.name)
       alert(`Success registration ${response.user?.email} ,confirm your email address!!`)
       navigate("/login-admin")
      
      } catch (err) {
       setError("An error occurred. Please try again.")
     } finally {
       setIsLoading(false)
       setFormData({
    name:"",
    email: "",
    password: "",
    confirm_password:""
  })
     }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">

      <div className="w-full max-w-md relative z-10">
        {/* Back to workspace link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to workspace
          </Link>
        </div>

        {/* Login Card */}
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r bg-blue-500  rounded-full flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Register admin</CardTitle>
            <CardDescription className="text-gray-600">Register to access helpdesk </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
        {/* name Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Name
                </Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              {/* email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

      


              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>


              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Retype your password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>



            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              {/* Login Button */}
              <Button
              onClick={handleRegister}
                type="submit"
                className="w-full h-11 bg-gradient-to-r bg-blue-500 hover:from-blue-700 hover:to-emerald-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>



              {/* Register Button */}
              <Link
                className="w-full  border-gray-200 text-md  font-medium transition-all duration-200 bg-slate-400 text-center p-2 rounded-md text-white"
                to={"/login-admin"}
              >
                Back to login
              </Link>


            </CardFooter>
          </form>
        </Card>


      </div>
    </div>
  )
}
