import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Slider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Videocam,
  Category,
  Person,
  Description,
  Settings,
  Public,
  Lock,
} from "@mui/icons-material";

import { Categories, Streams } from "@/types/Schema";
import { useRouter } from "next/navigation";
import { createAnItem } from "@/server-actions/streams";
import { useAppSelector } from "@/lib/hooks";
import { getUser } from "@/lib/features/userSlice";
import { CreateStreamResponse } from "@/lib/controller";

interface CreateStreamModalProps {
  open: boolean;
  onClose: () => void;
  categories: Categories[];
}

export default function CreateStreamModal({
  open,
  onClose,
  categories,
}: CreateStreamModalProps) {
  const [formData, setFormData] = useState<Partial<Streams>>({
    title: "",
    category: "",
    age_restriction: 13,
    description: "",
    is_public: true,
    max_viewers: 100,
  });

  const [errors, setErrors] = useState<Partial<Streams>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userState = useAppSelector(getUser);
  if (!userState) return;

  const validateForm = (): boolean => {
    const newErrors: Partial<Streams> = {};

    if (!formData?.title?.trim()) {
      newErrors.title = "Title is required";
    } else if (formData?.title?.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData?.description?.trim()) {
      newErrors.description = "Description is required";
    } else if (formData?.description?.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const onGoLive = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {
    // 1️⃣ create stream in backend
    const res = await createAnItem("streams", {
      ...formData,
      status: "live",
    });
    if (!res.success) {
      setErrors({ title: res?.data as string });
      setLoading(false);
      return;
    }

    // reset form & errors
    setFormData({
      title: "",
      category: "",
      age_restriction: 13,
      description: "",
      is_public: true,
      max_viewers: 100,
    });
    setErrors({});

    const streamData = res.data;

    // 2️⃣ create live room
    const liveRes = await fetch("/api/create_stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_name: streamData?.id,
        metadata: {
          creator_identity: `${userState?.first_name} ${userState?.last_name}`,
          enable_chat: true,
          allow_participation: true,
        },
      }),
    });

    const {
      auth_token,
      connection_details: { token },
    } = (await liveRes.json()) as CreateStreamResponse;

    // 3️⃣ redirect → keep loader until navigation
    router.push(`/stream/host?at=${auth_token}&rt=${token}`);

    // close popup & stop loading after navigation
    onClose();
    setLoading(false);
  } catch (error) {
    console.error("Failed to go live:", error);
    setLoading(false);
  }
};


  const handleChange = (field: keyof Streams, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#1a1a1a",
          color: "white",
          borderRadius: 2,
          border: "1px solid #333",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #333",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Videocam sx={{ color: "#1976d2" }} />
        <Typography component="span" variant="h6" sx={{ fontWeight: 600 }}>
          Create New Stream
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Stream Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Videocam sx={{ color: "#1976d2", fontSize: 20 }} />
            <TextField
              fullWidth
              label="Stream Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Enter an engaging title for your stream"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#2a2a2a",
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                },
                "& .MuiInputLabel-root": { color: "#bbb" },
                "& .MuiFormHelperText-root": { color: "#f44336" },
              }}
            />
          </Box>

          {/* Category Selection */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Category sx={{ color: "#1976d2", fontSize: 20 }} />
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel sx={{ color: "#bbb" }}>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                label="Category"
                sx={{
                  bgcolor: "#2a2a2a",
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#444",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#666",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.name}
                    value={category.name}
                    sx={{
                      color: "white",
                      bgcolor: "#2a2a2a",
                      "&:hover": {
                        bgcolor: "#333", // darker hover background
                        color: "white", // keep text visible
                      },
                      "&.Mui-selected": {
                        bgcolor: "#1976d2 !important", // selected background
                        color: "white",
                      },
                      "&.Mui-selected:hover": {
                        bgcolor: "#1565c0 !important", // selected+hover
                        color: "white",
                      },
                    }}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Age Restriction */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Person sx={{ color: "#1976d2", fontSize: 20 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                gutterBottom
                sx={{ color: "#bbb", fontSize: "0.875rem" }}
              >
                Minimum Age: {formData.age_restriction}+
              </Typography>
              <Slider
                value={formData?.age_restriction || 13}
                onChange={(_, value) => handleChange("age_restriction", value)}
                min={13}
                max={21}
                step={1}
                marks={[
                  { value: 13, label: "13+" },
                  { value: 16, label: "16+" },
                  { value: 18, label: "18+" },
                  { value: 21, label: "21+" },
                ]}
                sx={{
                  color: "#1976d2",
                  "& .MuiSlider-mark": { color: "#666" },
                  "& .MuiSlider-markLabel": {
                    color: "#888",
                    fontSize: "0.75rem",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Description */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Description sx={{ color: "#1976d2", fontSize: 20, mt: 1 }} />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Describe what your stream will be about..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#2a2a2a",
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                },
                "& .MuiInputLabel-root": { color: "#bbb" },
                "& .MuiFormHelperText-root": { color: "#f44336" },
              }}
            />
          </Box>

          {/* Stream Settings */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              bgcolor: "#2a2a2a",
              borderRadius: 1,
              border: "1px solid #333",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Settings sx={{ color: "#1976d2", fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Stream Settings
              </Typography>
            </Box>

            {/* Public/Private Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_public || false}
                  onChange={(e) => handleChange("is_public", e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#1976d2",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      bgcolor: "#1976d2",
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {formData.is_public ? (
                    <Public sx={{ fontSize: 16, color: "#4caf50" }} />
                  ) : (
                    <Lock sx={{ fontSize: 16, color: "#ff9800" }} />
                  )}
                  <Typography variant="body2">
                    {formData.is_public ? "Public Stream" : "Private Stream"}
                  </Typography>
                </Box>
              }
            />

            {/* Max Viewers */}
            <Box>
              <Typography
                gutterBottom
                sx={{ color: "#bbb", fontSize: "0.875rem" }}
              >
                Maximum Viewers: {formData.max_viewers}
              </Typography>
              <Slider
                value={formData.max_viewers || 100}
                onChange={(_, value) => handleChange("max_viewers", value)}
                min={10}
                max={1000}
                step={10}
                marks={[
                  { value: 10, label: "10" },
                  { value: 100, label: "100" },
                  { value: 500, label: "500" },
                  { value: 1000, label: "1K" },
                ]}
                sx={{
                  color: "#1976d2",
                  "& .MuiSlider-mark": { color: "#666" },
                  "& .MuiSlider-markLabel": {
                    color: "#888",
                    fontSize: "0.75rem",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Info Alert */}
          <Alert
            severity="info"
            sx={{
              bgcolor: "rgba(25, 118, 210, 0.1)",
              border: "1px solid rgba(25, 118, 210, 0.3)",
              color: "#90caf9",
              "& .MuiAlert-icon": { color: "#1976d2" },
            }}
          >
            Your stream will be visible to other users once you go live. Make
            sure your content follows our community guidelines.
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: "1px solid #333", p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#bbb",
            borderColor: "#666",
            "&:hover": {
              borderColor: "#888",
              bgcolor: "rgba(255,255,255,0.05)",
            },
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={onGoLive}
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Videocam />
            )
          }
          sx={{
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#1565c0" },
            "&:disabled": { bgcolor: "#666" },
            minWidth: 140,
          }}
        >
          {loading ? "Creating..." : "Go Live"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
