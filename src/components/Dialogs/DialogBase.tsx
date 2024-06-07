import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FC, ReactNode } from "react";

interface DialogBaseProps {
  title: string;
  open: boolean;
  handleClose: () => void;
  doAction: {
    name: string;
    handle: () => void;
  };
  children: ReactNode;
}

export const DialogBase: FC<DialogBaseProps> = ({ title, doAction, open, handleClose, children }: DialogBaseProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: (theme) => theme.spacing(2),
            width: "30rem",
            padding: (theme) => theme.spacing(2, 4, 4, 4),
          }}
        >
          {children}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button onClick={doAction.handle}>{doAction.name}</Button>
      </DialogActions>
    </Dialog>
  );
};
