import { TextField } from "@mui/material";
import { FC, useCallback, useContext, useState } from "react";
import { AppContext } from "../App/App";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface CreatePlayerDialogProps extends BaseDialogProps {}

export const CreatePlayerDialog: FC<CreatePlayerDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
}: CreatePlayerDialogProps) => {
  const { requests, setAlertMessage } = useContext(AppContext);
  const [name, setName] = useState<string>("");

  const resetForm = () => setName("");

  const createRequest = useCallback(() => {
    if (name.trim() === "") {
      setAlertMessage("Name is required!");
      return;
    }

    const data = { name };

    requests.createPlayerRequest({ requestBody: data }, (_: any) => {
      handleReload();
      closeDialog();
      resetForm();
    });
  }, [name]);

  return (
    <DialogBase
      title={"Create player"}
      open={dialogIsOpen}
      doAction={{ name: "Create", handle: createRequest }}
      handleClose={() => {
        closeDialog();
        resetForm();
      }}
    >
      <TextField
        label={"Player name"}
        required
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
    </DialogBase>
  );
};
