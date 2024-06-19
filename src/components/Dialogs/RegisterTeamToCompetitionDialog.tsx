import { Autocomplete, Box, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { CompetitionDisplayDTO } from "../../utils/Types";
import { useValidation } from "../../utils/UseValidation";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface RegisterTeamToCompetitionDialogProps extends BaseDialogProps {
  id: string;
  reloadDialogData: boolean;
}

export const RegisterTeamToCompetitionDialog: FC<RegisterTeamToCompetitionDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
  id,
  reloadDialogData,
}: RegisterTeamToCompetitionDialogProps) => {
  const { user, requests } = useContext(AppContext);
  const [teams, setTeams] = useState<CompetitionDisplayDTO[]>([]);

  const teamId = "teamId";

  const validation = useValidation(
    [
      {
        name: teamId,
        defaultValue: undefined,
        conditions: [{ expression: (value: any) => value === undefined, errorMessage: "Select a Team!" }],
      },
    ],
    []
  );

  useEffect(() => {
    if (user?.role !== UserRole.Administrator && !dialogIsOpen) return;
    getTeamsThatCanBeAddedToCompetition();
  }, [dialogIsOpen, reloadDialogData]);

  const resetForm = () => validation.setFieldValue(teamId, undefined);

  const getTeamsThatCanBeAddedToCompetition = useCallback(
    () => requests.getTeamsThatCanBeAddedToCompetitionRequest({ id }, (data: any) => setTeams(data)),
    [id]
  );

  const registerTeamRequest = useCallback(() => {
    if (!validation.pass()) return;
    const data = validation.getData();
    requests.registerCompetitorToCompetitionAdminRequest({ id, auxId: data[teamId] }, (_: any) => {
      handleReload();
      closeDialog();
      resetForm();
    });
  }, [id, validation]);

  return (
    <DialogBase
      title={"Register team"}
      open={dialogIsOpen}
      doAction={{ name: "Register", handle: registerTeamRequest }}
      handleClose={() => {
        closeDialog();
        resetForm();
      }}
    >
      <Box>
        <Autocomplete
          autoHighlight
          options={teams}
          getOptionLabel={(team) => team.name}
          filterOptions={(x) => x}
          onChange={(_, value) => validation.setFieldValue(teamId, value?.id)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Team"
              error={Boolean(validation.errors[teamId]?.error)}
            />
          )}
        />
        <FormErrorMessage>{validation.errors[teamId]?.error}</FormErrorMessage>
      </Box>
    </DialogBase>
  );
};
