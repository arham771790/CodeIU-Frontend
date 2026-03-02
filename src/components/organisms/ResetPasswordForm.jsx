"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { axiosInstanceAuthService } from "@/lib/axios";
import { toast } from "react-toastify";

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

export default function ResetPasswordForm() {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isVerifying, setIsVerifying] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { passwordChange } = useAuthStore();

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsVerifying(false);
                setIsVerified(false);
                return;
            }

            try {
                const res = await axiosInstanceAuthService.get(`/auth/verify-id/${token}`);
                if (res?.data?.success) {
                    setIsVerified(true);
                } else {
                    setIsVerified(false);
                    toast.error("Invalid or expired reset link.");
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                setIsVerified(false);
                toast.error("Verification failed. Please try again.");
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

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
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            const payload = {
                password: formData.password,
                id: token,
            };

            const success = await passwordChange(payload);
            setIsSubmitting(false);

            if (success) {
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        }
    };

    if (isVerifying) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isVerified) {
        return (
            <div className="bg-gray-100 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center m-4">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Link Invalid</h1>
                <p className="text-gray-700 mb-6">This password reset link is invalid or has expired.</p>
                <Link href="/forget-user" className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                    Request New Link
                </Link>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col w-full max-w-md m-4 bg-gray-100 shadow-2xl rounded-2xl overflow-hidden p-8 sm:p-12">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Security</h3>
            <h1 className="text-3xl font-bold text-black mb-1">Reset Password</h1>
            <p className="text-gray-600 mb-8">Please enter your new password below.</p>

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
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

                <div className="mb-8">
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                            className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black`}
                        />
                        <EyeIcon
                            toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                            isVisible={showConfirmPassword}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        "Update Password"
                    )}
                </button>
            </form>
        </div>
    );
}
