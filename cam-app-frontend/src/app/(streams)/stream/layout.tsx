"use client";

import { Box } from "@mui/material";
import { useAppDispatch } from "@/lib/hooks";
import { useEffect } from "react";
import { getUserData } from "@/server-actions/auth";
import { updateUser } from "@/lib/features/userSlice";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getSettings() {
      const res = await getUserData();
      if (res) dispatch(updateUser(res));
    }
    getSettings();
  }, []);

  return <Box>{children}</Box>;
}