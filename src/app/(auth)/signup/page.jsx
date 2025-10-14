"use client";

import { useState } from "react";
import { Eye, EyeOff, Github , Linkedin } from 'lucide-react';
import { useAuthStore } from "@/app/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock implementation for the auth store for demonstration purposes


// --- SVG Icons ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.638 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);


const AppleIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.226 1.343a4.846 4.846 0 00-1.74.062 4.81 4.81 0 00-2.81 2.375c-.21.383-.39.782-.544 1.192a10.854 10.854 0 01-1.928.016c-1.023.08-2.39.5-3.35 1.63-1.42 1.68-1.82 4.1-1.23 6.13.58 2.01 2.14 4.02 4.02 4.02.48 0 .81-.13 1.36-.42a10.9 10.9 0 001.37-1.33c.63-.78 1.1-1.77.92-2.81-.17-1.01-1.1-1.73-2.12-1.73-.78 0-1.46.4-1.98.92-.05.05-.08.06-.11.08-.83.82-1.23 1.84-1.12 2.9.11 1.05.74 2.12 1.62 2.82.9.7 2.15 1.19 3.4 1.19.64 0 1.28-.15 1.88-.45a4.7 4.7 0 003.04-2.86c.2-.42.36-.83.5-1.24a10.2 10.2 0 011.66-.03c.53-.05 2.12-.29 3.3-1.65 1.2-1.4 1.61-3.3 1.02-5.02-.58-1.7-2.01-3.2-3.6-3.2-.23 0-.7.08-1.2.3-.49.21-.92.5-1.28.85-.6.6-1.03 1.4-1.5 2.13-.12.18-.23.36-.35.53-.02.03-.04.05-.06.07a1.9 1.9 0 01-2.43-.53c-.3-.32-.57-.69-.8-1.09-.56-1-1-1.95-1.26-2.9-.27-.95.04-2.03.73-2.73a3.8 3.8 0 012.82-1.39c.14-.02.28-.03.42-.03zM15.4 1.07c-.52.02-1.12.18-1.6.45-.85.47-1.55 1.3-1.85 2.3-.3 1-.16 2.08.38 3.01.5.86 1.2 1.65 1.98 2.2.04.03.07.05.1.08a2.9 2.9 0 003.7-1.02c.07-.1.14-.2.2-.3.6-1 1.2-2.1 1.05-3.38-.15-1.29-1.03-2.5-2.2-2.9-1.02-.34-2.11-.4-2.56-.42z"/>
    </svg>
);

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuthStore();
  const router= useRouter()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email   = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "A valid email is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "User name is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await signup(formData); // ✅ assume signup returns true/false
      if (success) {
        router.push("/login"); // ✅ redirect on success
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-sans">
      <div className="relative flex flex-col md:flex-row w-full max-w-4xl m-4 md:m-8 bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-black text-white flex flex-col  items-start">
          <h2 className="text-3xl font-mono mb-2">Join us</h2>
          <h1 className="text-3xl font-mono mb-4">Create a CodeIU account</h1>
          <p className="text-md text-gray-300">
            Be part of a strong community of developers
          </p>
        </div>

        {/* Right Panel: Signup Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 text-black">
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Welcome !</h3>
          <h1 className="text-3xl font-bold text-black mb-1">Sign up to</h1>
          <p className="text-gray-600 mb-8">CodeIU</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Input */}
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Username Input */}
            <div className="mb-5">
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">User name</label>
              <input
                type="text" id="username" name="username"
                value={formData.username} onChange={handleChange}
                placeholder="Enter your user name"
                className={`w-full px-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black`}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Password Input */}
            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} id="password" name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter your Password"
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            {/* Confirm Password Input */}
            <div className="mb-5">
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Confirm your Password"
                  className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300">
              Register
            </button>
          </form>
          
          <div className="text-center my-4 text-sm text-gray-600">
            Already have an Account? <a href="/login" className="font-semibold text-black hover:underline">Sign in</a>
          </div>

          <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or you can sign in with</span></div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
                <button type="button" className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"><GoogleIcon /></button>
                <button type="button" className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"><Github className="w-5 h-5" /></button>
                <button type="button" className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"><AppleIcon /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

