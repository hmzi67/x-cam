"use client";

import { handleLogout } from "@/server-actions/auth";
import { Button, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import LogoutIcon from '@mui/icons-material/Logout';

export default function LogoutButton() {
  const router = useRouter();

  const logOut = async () => {
    await handleLogout(); // Call server action to logout
    router.push("/login"); // redirect after logout
  };

  return (
    <Button color="inherit" onClick={logOut}>
      <Tooltip title="Logout">
        <LogoutIcon fontSize="medium" sx={{ mr: 0.5 }} />
      </Tooltip>
    </Button>
  );
}
