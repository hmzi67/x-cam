import { Categories } from "@/types/Schema";
import { Create } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import CreateStreamModal from "./CreateStreamModal";

export default function CreateStreamButton({
  categories,
}: {
  categories: Categories[];
}) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const onClose = () => setOpenCreateDialog(false);

  return (
    <>
      <Button color="inherit" onClick={() => setOpenCreateDialog(true)}>
        Create Stream
      </Button>
      <CreateStreamModal
        open={openCreateDialog}
        onClose={onClose}
        categories={categories}
      />
    </>
  );
}
