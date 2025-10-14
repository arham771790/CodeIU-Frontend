"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Github, Apple , Loader2} from 'lucide-react';
import { useAuthStore } from "@/app/store/useAuthStore";

// Custom Google Icon SVG Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.638 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

// A simple eye icon component for the password field using lucide-react
const EyeIcon = ({ toggleVisibility, isVisible }) => (
  <button
    type="button"
    onClick={toggleVisibility}
    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
    aria-label={isVisible ? "Hide password" : "Show password"}
  >
    {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
  </button>
);

// Mock implementation for the auth store for demonstration purposes

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { login , isLoggingIn } = useAuthStore();



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  


  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "User name is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "A valid email is required for the user name";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const res = await login(formData);
      console.log("form data............................");
      console.log(formData);

      console.log("responce............................");
      console.log(res);

      if (res) {
        
        router.push("/problem");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-sans">
      <div className="relative flex flex-col md:flex-row w-full max-w-4xl m-4 md:m-8 bg-gray-100 shadow-2xl rounded-2xl overflow-hidden">

        {/* Left Panel: Signup Call-to-Action */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-black text-white flex flex-col justify-center items-start">
          <h2 className="text-2xl font-medium mb-2">Join us</h2>
          <h1 className="text-4xl font-mono mb-4">Create a CodeIU account</h1>
          <p className="text-lg text-gray-300 font-mono">
            Be part of a strong community of developers
          </p>
          <Link href="/signup" className="mt-8 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors duration-300">
            Sign Up
          </Link>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Welcome !</h3>
          <h1 className="text-3xl font-bold text-black mb-1">Sign in to</h1>
          <p className="text-gray-600 mb-8">CodeIU</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your Password"
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black`}
                />
                <EyeIcon 
                  toggleVisibility={() => setShowPassword(!showPassword)} 
                  isVisible={showPassword}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="#" className="font-medium text-black hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full  flex items-center justify-center bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
            >
              {
                isLoggingIn ? (
                  <> <Loader2 className="h-5 w-5 animate-spin" /></>
                ) : ( "Sign In") 

              }
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-100 text-gray-500">or you can sign in with</span>
                </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
                <button
                    type="button"
                    className="p-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    aria-label="Sign in with Google"
                >
                    <GoogleIcon />
                </button>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
