"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Checkbox,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce"; // adjust path as needed
import { Categories } from "@/types/Schema";

export default function Sidebar({ categories }: { categories: Categories[] }) {
  const router = useRouter();

  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const debouncedSubs = useDebounce(selectedSubs, 500);

  const mainCategories = categories.filter((cat) => !cat.parent_name);

  const handleCheckboxChange = (subName: string) => {
    setSelectedSubs((prev) =>
      prev.includes(subName)
        ? prev.filter((s) => s !== subName)
        : [...prev, subName]
    );
  };

  // Update route when filters change (debounced)
  useEffect(() => {
    if (debouncedSubs.length > 0) {
      router.push(`/stream?filters=${debouncedSubs.join(",")}`);
    } else {
      router.push(`/stream`);
    }
  }, [debouncedSubs, router]);

  return (
    <Box
      sx={{
        width: 250,
        mr: 2,
        bgcolor: "#1a1a1a",
        color: "white",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {mainCategories.map((main) => (
        <Accordion
          key={main.name}
          disableGutters
          sx={{ bgcolor: "transparent", "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            sx={{ px: 2, py: 1 }}
          >
            <Typography sx={{ fontWeight: "medium", color: "#bbb" }}>
              {main.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              {categories
                .filter((sub) => sub.parent_name === main.name)
                .map((sub) => (
                  <ListItemButton
                    key={sub.name}
                    sx={{ px: 2, py: 1, "&:hover": { bgcolor: "#333" } }}
                  >
                    <Checkbox
                      checked={selectedSubs.includes(sub.name)}
                      onChange={() => handleCheckboxChange(sub.name)}
                      sx={{
                        color: "#bbb",
                        "&.Mui-checked": { color: "white" },
                        mr: 1,
                      }}
                    />
                    <ListItemText primary={sub.name} sx={{ color: "#bbb" }} />
                  </ListItemButton>
                ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
