import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "1rem",
          width: "30rem",
        }}
      >
        {children}
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
