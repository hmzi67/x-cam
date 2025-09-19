"use client";

import {
  loginMfaGeneration,
  loginMfaVerification,
} from "@/server-actions/auth";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { LinearProgress, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getUser, updateUser } from "@/lib/features/userSlice";
import { setSessionCookie } from "@/app/actions/session";

export interface LoginFormData {
  email: string;
  password: string;
  mfa_code: string;
  remember: boolean;
}

export default function LoginForm() {
  const router = useRouter();
  const userState = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    status: string;
    message: string;
  } | null>();
  const [formState, setFormState] = useState<LoginFormData>({
    email: "",
    password: "",
    mfa_code: "",
    remember: false,
  });
  const [mfa, setMfa] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (mfa) {
      const res = await loginMfaVerification(formState);
      if (res.success) {
        await setSessionCookie(res.data);
        dispatch(updateUser(res.data));
      } else {
        setError({ message: res.data as string, status: "error" });
        setLoading(false);
      }
    } else {
      const res = await loginMfaGeneration(formState);
      if (res.success) {
        setMfa(true);
        setLoading(false);
        setError(null);
      } else {
        setError({ message: res.data as string, status: "error" });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userState?.access_token) {
      router.push("/");
    }
  }, [userState]);

  return (
    <form>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email Address"
        name="email"
        id="email"
        autoComplete="email"
        value={formState.email}
        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
        autoFocus
      />
      {!mfa && (
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          name="password"
          id="password"
          value={formState.password}
          onChange={(e) =>
            setFormState({ ...formState, password: e.target.value })
          }
          autoComplete="current-password"
          hidden={!!mfa}
        />
      )}
      {!mfa && (
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) =>
                setFormState({ ...formState, remember: e.target.checked })
              }
              value={formState.remember}
              color="primary"
            />
          }
          id="remember"
          name="remember"
          label="Remember me"
          hidden={!!mfa}
        />
      )}
      {mfa && (
        <>
          <Typography>
            Please check your inbox and paste the code you received in the email
            below:
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="mfa_code"
            label="MFA Code"
            name="mfa_code"
            autoComplete="email"
            autoFocus
            value={formState.mfa_code}
            onChange={(e) =>
              setFormState({ ...formState, mfa_code: e.target.value })
            }
          />
        </>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 1, mb: 2 }}
        disabled={loading}
        onClick={handleSubmit}
      >
        Sign In
      </Button>

      {loading && <LinearProgress sx={{ mb: 1 }} />}

      {error?.status === "error" && (
        <Alert severity="error">{error?.message}</Alert>
      )}
    </form>
  );
}
