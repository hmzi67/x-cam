import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XCams - Login & Registration",
  description: "Sign in or create your XCams account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
