import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ResetPasswordForm from "@/components/organisms/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black font-sans">
            <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-white" />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
