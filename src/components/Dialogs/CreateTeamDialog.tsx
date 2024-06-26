import { Box, Button, TextField } from "@mui/material";
import { FC, useCallback, useContext } from "react";
import { useValidation } from "../../utils/UseValidation";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface CreateTeamDialogProps extends BaseDialogProps {}

export const CreateTeamDialog: FC<CreateTeamDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
}: CreateTeamDialogProps) => {
  const { requests } = useContext(AppContext);

  const name = "name";

  const validation = useValidation(
    [
      {
        name: name,
        defaultValue: "",
        conditions: [{ expression: (value: string) => value.trim() === "", errorMessage: "Name is required!" }],
      },
    ],
    []
  );

  const createRequest = useCallback(() => {
    if (!validation.pass()) return;
    const data = validation.getData();
    requests.createTeamRequest({ requestBody: data }, (_: any) => {
      handleReload();
      closeDialog();
      validation.reset();
    });
  }, [validation]);

  return (
    <DialogBase
      title={"Create team"}
      open={dialogIsOpen}
      handleClose={() => {
        closeDialog();
        validation.reset();
      }}
      buttons={[<Button onClick={createRequest}>Create</Button>]}
    >
      <Box>
        <TextField
          fullWidth
          label={"Team name"}
          required
          value={validation.errors[name]?.value}
          error={Boolean(validation.errors[name]?.error)}
          onChange={(event) => validation.setFieldValue(name, event.currentTarget.value)}
        />
        <FormErrorMessage>{validation.errors[name]?.error}</FormErrorMessage>
      </Box>
    </DialogBase>
  );
};
