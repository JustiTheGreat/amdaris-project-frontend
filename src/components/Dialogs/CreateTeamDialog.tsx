import { TextField } from "@mui/material";
import { FC, useCallback, useContext, useState } from "react";
import { AppContext } from "../App/App";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface CreateTeamDialogProps extends BaseDialogProps {}

export const CreateTeamDialog: FC<CreateTeamDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
}: CreateTeamDialogProps) => {
  const { requests, setAlertMessage } = useContext(AppContext);
  const [name, setName] = useState<string>("");

  const resetForm = () => setName("");

  const createRequest = useCallback(() => {
    if (name.trim() === "") {
      setAlertMessage("Name is required!");
      return;
    }

    const data = { name };

    requests.createTeamRequest({ requestBody: data }, (_: any) => {
      handleReload();
      closeDialog();
      resetForm();
    });
  }, [name]);

  return (
    <DialogBase
      title={"Create team"}
      open={dialogIsOpen}
      doAction={{ name: "Create", handle: createRequest }}
      handleClose={() => {
        closeDialog();
        resetForm();
      }}
    >
      <TextField
        label={"Team name"}
        required
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
    </DialogBase>
  );
};
