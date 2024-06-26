import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FC, ReactNode } from "react";

export interface BaseDialogProps {
  dialogIsOpen: boolean;
  closeDialog: () => void;
  handleReload: () => void;
}

interface DialogBaseProps {
  title: string;
  open: boolean;
  handleClose: () => void;
  buttons: JSX.Element[];
  children: ReactNode;
}

export const DialogBase: FC<DialogBaseProps> = ({ title, open, handleClose, buttons, children }: DialogBaseProps) => {
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
            width: "25rem",
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
        {buttons}
      </DialogActions>
    </Dialog>
  );
};
