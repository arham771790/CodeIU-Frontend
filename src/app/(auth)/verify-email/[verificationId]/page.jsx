"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function VerifyEmailPage() {
    const params = useParams();
    const verificationId = params.verificationId;
    const { verifyEmail } = useAuthStore();

    const [status, setStatus] = useState("verifying"); // verifying, success, error

    useEffect(() => {
        const verify = async () => {
            if (!verificationId) {
                setStatus("error");
                return;
            }

            const success = await verifyEmail(verificationId);
            setStatus(success ? "success" : "error");
        };

        verify();
    }, [verificationId, verifyEmail]);

    console.log(status);
    console.log(verificationId);
    
    if (status === "verifying") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black font-sans">
                <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black font-sans">
                <div className="bg-gray-100 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center m-4">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
                    <p className="text-gray-600 mb-6">
                        Your email has been successfully verified. You can now log in to your account.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black font-sans">
            <div className="bg-gray-100 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center m-4">
                <div className="flex justify-center mb-4">
                    <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                <p className="text-gray-600 mb-6">
                    The verification link is invalid, expired, or something went wrong.
                </p>
                <Link
                    href="/login"
                    className="inline-block px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );
}
