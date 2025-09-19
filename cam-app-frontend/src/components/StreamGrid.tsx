// import { Categories, Streams } from "@/types/Schema";
// import {
//   Box,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Button,
// } from "@mui/material";
// import Link from "next/link";

// export default function StreamGrid({
//   streams,
//   isLoggedIn,
//   balance,
// }: {
//   streams: Streams[];
//   isLoggedIn: boolean;
//   balance: number;
// }) {
//   const handleClick = (stream: any) => {
//     if (!isLoggedIn || balance <= 0) return "/register";
//     return `/stream/${stream.id}`;
//   };

//   return (
//     <Box
//       sx={{
//         display: "grid",
//         gridTemplateColumns: {
//           xs: "1fr",
//           sm: "repeat(2, 1fr)",
//           md: "repeat(3, 1fr)",
//         },
//         gap: 2,
//       }}
//     >
//       {streams.length === 0 ? (
//         <Typography sx={{ color: "#bbb" }}>No streams available...</Typography>
//       ) : (
//         streams.map((stream) => (
//           <Card
//             key={stream.id}
//             sx={{
//               cursor: "pointer",
//               transition: "transform 0.3s",
//               "&:hover": { transform: "scale(1.05)", boxShadow: 3 },
//             }}
//           >
//             <CardMedia
//               component="img"
//               height="180"
//               image={stream.playback_url ?? "placeholder.jpg"}
//               alt={stream.title ?? ""}
//               sx={{
//                 filter: !isLoggedIn || balance <= 0 ? "blur(10px)" : "none",
//                 transition: "filter 0.3s",
//               }}
//             />
//             <CardContent sx={{ bgcolor: "#1a1a1a", color: "white" }}>
//               <Typography variant="h6" sx={{ mb: 1 }}>
//                 {stream.title}
//               </Typography>
//               <Typography variant="body2" sx={{ color: "#bbb" }}>
//                 Category:{" "}
//                 {(stream.category as Categories).name || "Uncategorized"}
//               </Typography>
//               <Link href={handleClick(stream)} passHref>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{
//                     mt: 2,
//                     width: "100%",
//                     bgcolor: "#1976d2",
//                     "&:hover": { bgcolor: "#1565c0" },
//                   }}
//                 >
//                   {isLoggedIn && balance > 0
//                     ? "Watch Now"
//                     : "Sign Up to Unlock"}
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </Box>
//   );
// }
import { Categories, Streams } from "@/types/Schema";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { PlayArrow, Lock, Public, Visibility } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StreamGrid({
  streams,
  isLoggedIn,
  balance,
}: {
  streams: Streams[];
  isLoggedIn: boolean;
  balance: number;
}) {
  const router = useRouter();
  const canJoinStream = isLoggedIn; //&& balance > 0

  const handleJoinStream = (streamId: number) => {
    if (!canJoinStream) {
      router.push("/register");
      return;
    }
    // Navigate to stream viewer page
    router.push(`/stream/${streamId}`);
  };

  const getStreamStatus = (stream: Streams) => {
    if (stream.status === "live") {
      return { color: "#4caf50", text: "LIVE" };
    } else if (stream.status === "scheduled") {
      return { color: "#ff9800", text: "SCHEDULED" };
    }
    return { color: "#757575", text: "OFFLINE" };
  };

  const formatViewerCount = (count: number = 0) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 3,
        p: 2,
      }}
    >
      {streams.length === 0 ? (
        <Box
          sx={{
            gridColumn: "1 / -1",
            textAlign: "center",
            py: 8,
            color: "#bbb",
          }}
        >
          <Typography variant="h6">No streams available</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Be the first to go live!
          </Typography>
        </Box>
      ) : (
        streams.map((stream) => {
          const status = getStreamStatus(stream);
          return (
            <Card
              key={stream.id}
              sx={{
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)",
                border: "1px solid #333",
                borderRadius: 2,
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                  borderColor: "#1976d2",
                },
              }}
              onClick={() => handleJoinStream(stream.id)}
            >
              {/* Stream Thumbnail */}
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={stream.playback_url ?? "/api/placeholder/400/200"}
                  alt={stream.title ?? "Stream thumbnail"}
                  sx={{
                    filter: !canJoinStream ? "blur(10px)" : "none",
                    transition: "filter 0.3s",
                    objectFit: "cover",
                  }}
                />

                {/* Status Badge */}
                <Chip
                  label={status.text}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    bgcolor: status.color,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}
                />

                {/* Viewer Count */}
                {stream.status === "live" && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "rgba(0,0,0,0.7)",
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Visibility
                      sx={{ fontSize: 14, mr: 0.5, color: "white" }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      {formatViewerCount(Math.floor(Math.random() * 1000))}
                    </Typography>
                  </Box>
                )}

                {/* Lock Overlay for unauthorized users */}
                {!canJoinStream && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(0,0,0,0.6)",
                    }}
                  >
                    <Lock sx={{ fontSize: 40, color: "white", opacity: 0.8 }} />
                  </Box>
                )}
              </Box>

              {/* Stream Info */}
              <CardContent sx={{ bgcolor: "#1a1a1a", color: "white", p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      lineHeight: 1.3,
                      flexGrow: 1,
                      mr: 1,
                    }}
                    noWrap
                  >
                    {stream.title || "Untitled Stream"}
                  </Typography>
                  {stream.is_public ? (
                    <Public sx={{ fontSize: 16, color: "#4caf50" }} />
                  ) : (
                    <Lock sx={{ fontSize: 16, color: "#ff9800" }} />
                  )}
                </Box>

                <Typography
                  variant="body2"
                  sx={{ color: "#bbb", mb: 1, fontSize: "0.875rem" }}
                >
                  {(stream.category as Categories)?.name || "Uncategorized"}
                </Typography>

                {/* Creator Info */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="caption" sx={{ color: "#888" }}>
                    by {(stream.creator_id as any)?.first_name || "Anonymous"}
                  </Typography>
                </Box>

                {/* Action Button */}
                <Link
                  href={
                    canJoinStream
                      ? `/stream/host/${stream.id}?role=Audience`
                      : "/login"
                  }
                  passHref
                >
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={canJoinStream ? <PlayArrow /> : <Lock />}
                    sx={{
                      py: 1.5,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textTransform: "none",
                      bgcolor: canJoinStream ? "#1976d2" : "#1976d2",
                      "&:hover": {
                        bgcolor: canJoinStream ? "#1565c0" : "#555",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    disabled={!canJoinStream}
                  >
                    {canJoinStream ? "Join Stream" : "Login to Join"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
}
