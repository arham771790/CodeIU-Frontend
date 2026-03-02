import VerifyEmailView from "@/components/organisms/VerifyEmailView";

export default async function VerifyEmailPage({ params }) {
    const { verificationId } = await params;
    return (
        <div className="min-h-screen flex items-center justify-center bg-black font-sans">
            <VerifyEmailView verificationId={verificationId} />
        </div>
    );
}
