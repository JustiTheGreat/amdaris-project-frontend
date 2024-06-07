import { TextField } from "@mui/material";
import { FC, useCallback, useContext, useState } from "react";
import { AppContext } from "../App/App";
import { DialogBase } from "./DialogBase";

export const CreatePlayerDialog: FC = () => {
  const { requests, createDialogIsOpen, closeCreateDialog, doReload, setAlertMessage } = useContext(AppContext);
  const [name, setName] = useState<string>("");

  const resetForm = () => setName("");

  const createRequest = useCallback(() => {
    if (name.trim() === "") {
      setAlertMessage("Name is required!");
      return;
    }

    const data = { name };

    requests.createPlayerRequest({ requestBody: data }, (_: any) => {
      doReload();
      closeCreateDialog();
      resetForm();
    });
  }, [name]);

  return (
    <DialogBase
      title={"Create player"}
      open={createDialogIsOpen}
      doAction={{ name: "Create", handle: createRequest }}
      handleClose={() => {
        closeCreateDialog();
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
