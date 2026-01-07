
"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function ForgetUser() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState("");

    const { forgetPasswordRequest } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Email is required");
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        // Assuming API takes { email: "..." }
        const success = await forgetPasswordRequest({ email });

        setIsSubmitting(false);

        if (success) {
            setIsSent(true);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black font-sans">
                <div className="bg-gray-100 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center m-4">
                    <div className="mb-4 flex justify-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <Mail className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-black mb-4">Check your email</h1>
                    <p className="text-gray-700 mb-6">
                        We've sent a password reset link to <span className="font-semibold">{email}</span>.
                    </p>
                    <Link href="/login" className="block w-full px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                        Back to Login
                    </Link>
                    <div className="mt-4">
                        <button onClick={() => setIsSent(false)} className="text-sm text-gray-500 hover:text-gray-700 underline">
                            Did not receive the email? Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black font-sans">
            <div className="relative flex flex-col w-full max-w-md m-4 bg-gray-100 shadow-2xl rounded-2xl overflow-hidden p-8 sm:p-12">
                <h3 className="text-xl font-semibold text-gray-500 mb-2">Recovery</h3>
                <h1 className="text-3xl font-bold text-black mb-1">Forgot Password?</h1>
                <p className="text-gray-600 mb-8">Enter your email to receive a reset link.</p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError("");
                                }}
                                placeholder="Enter your email"
                                className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black`}
                            />
                        </div>
                        {error && (
                            <p className="text-red-500 text-xs mt-1">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm text-gray-600 hover:text-black hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
