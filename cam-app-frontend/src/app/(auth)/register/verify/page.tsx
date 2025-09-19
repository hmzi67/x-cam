import { verifyEmailToken } from "@/server-actions/auth";
import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams?.token;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500 text-lg font-medium">
          Invalid or missing verification token.
        </p>
      </div>
    );
  }
  const verifyEmail = await verifyEmailToken(token);

  if (verifyEmail.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-green-500 text-lg font-medium">
          Email verified successfully! You can now log in.
        </p>
        <Link href="/login">
          <button className="mt-4 px-8 py-5 bg-blue-500 text-white rounded">
            Go to Login
          </button>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500 text-lg font-medium">
          Failed to verify email. Please try again.
        </p>
      </div>
    );
  }
}
