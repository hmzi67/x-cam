import type { Metadata } from "next";

import Box from "@mui/material/Box";
import Image from "next/image";
import { Card } from "@mui/material";

export const metadata: Metadata = {
  title: "ReferralGPS Login",
  description: "ReferralGPS Login Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box
      sx={{
        position: "relative",
        "&:before": {
          content: '""',
          background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
          position: "absolute",
          height: "100%",
          width: "100%",
          opacity: "0.3",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          px: 2,
        }}
      >
        <Card
          elevation={9}
          sx={{
            p: 4,
            zIndex: 1,
            width: "100%",
            maxWidth: "420px", // decreased width
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            <Image alt="XCams Logo" width={263} height={35} src="/logo.svg" />
          </Box>
          {children}
        </Card>
      </Box>
    </Box>
  );
}
