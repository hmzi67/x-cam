import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeClient from "@/components/Themewrapper";
import StoreProvider from "./StoreProvider";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XCams",
  description: "XCams CRM",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          backgroundImage: `url(https://i.postimg.cc/3NLzpqPZ/groovepaper.png)`,
        }}
      >
        <NextTopLoader />
        {/* <ThemeClient> */}
        <StoreProvider>{children}</StoreProvider>
        {/* </ThemeClient> */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
