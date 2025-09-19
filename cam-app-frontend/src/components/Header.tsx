"use client";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";
import SearchBar from "./SearchBar";
import LogoutButton from "./LogoutButton";
import { useAppSelector } from "@/lib/hooks";
import { getUser } from "@/lib/features/userSlice";
import { Categories } from "@/types/Schema";
import CreateStreamButton from "./CreateStreamButton";

export default function Header({ categories }: { categories: Categories[] }) {
  const user = useAppSelector(getUser);
  console.log({ user });
  return (
    <AppBar position="static" sx={{ bgcolor: "#121212" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 0, mr: 2 }}>
          Xcams
        </Typography>
        <SearchBar />

        {user?.id ? (
          <CreateStreamButton categories={categories} />
        ) : (
          <Button
            color="inherit"
            component={Link}
            href="/register"
            sx={{ mx: 1 }}
          >
            Join Free
          </Button>
        )}
        {user?.id ? (
          <LogoutButton />
        ) : (
          <Button color="inherit" component={Link} href="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
