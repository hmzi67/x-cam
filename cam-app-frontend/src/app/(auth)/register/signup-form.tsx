"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { useFormStatus } from "react-dom";
import { Alert, Button, LinearProgress } from "@mui/material";
import { handleSignUp } from "@/server-actions/auth";

const defaultState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function SignUpForm() {
  const [formState, setFormState] = useState(defaultState);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    status: "error" | "success";
    message: string;
  } | null>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formState.first_name ||
      !formState.last_name ||
      !formState.email ||
      !formState.password ||
      !formState.confirm_password
    ) {
      setLoading(false);
      setMessage({ message: "All fields are required", status: "error" });
      return;
    }

    if (formState.password !== formState.confirm_password) {
      setLoading(false);
      setMessage({ message: "Passwords do not match", status: "error" });
      return;
    }

    try {
      const res = "password" in formState && (await handleSignUp(formState));
      if (res) {
        setLoading(false);
        setFormState(defaultState);
        setMessage({
          message:
            "Your registration has been successfully submitted. Please wait for your request to be reviewed. You will receive an email notification once it has been approved.",
          status: "success",
        });
      } else
        throw new Error(
          "Something went wrong. Please contact us at itsupport@referralgps.com."
        );
    } catch (err: any) {
      console.log(err.message);
      setMessage({ message: err.message, status: "error" });
      setLoading(false);
    }
  };

  return (
    <>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="first_name"
        label="First Name"
        name="first_name"
        autoFocus
        value={formState?.first_name}
        onChange={(e) =>
          setFormState({ ...formState, first_name: e.target.value })
        }
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="last_name"
        label="Last Name"
        name="last_name"
        autoFocus
        value={formState?.last_name}
        onChange={(e) =>
          setFormState({ ...formState, last_name: e.target.value })
        }
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formState?.email}
        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        type="password"
        id="password"
        label="password"
        name="password"
        autoFocus
        value={formState?.password}
        onChange={(e) =>
          setFormState({ ...formState, password: e.target.value })
        }
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        type="password"
        id="confirm_password"
        label="Retype Password"
        name="confirm_password"
        autoFocus
        value={formState?.confirm_password}
        onChange={(e) =>
          setFormState({ ...formState, confirm_password: e.target.value })
        }
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
        disabled={loading}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>

      {loading && <LinearProgress sx={{ mb: 1 }} />}
      {message?.status && (
        <Alert severity={message?.status}>{message?.message}</Alert>
      )}
    </>
  );
}
