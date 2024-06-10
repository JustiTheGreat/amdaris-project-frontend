import { Autocomplete, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { CompetitionDisplayDTO } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface RegisterTeamDialogProps extends BaseDialogProps {
  id: string;
}

export const RegisterTeamDialog: FC<RegisterTeamDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
  id,
}: RegisterTeamDialogProps) => {
  const { user, requests } = useContext(AppContext);
  const [teams, setTeams] = useState<CompetitionDisplayDTO[]>([]);
  const [teamId, setTeamId] = useState<string>();

  useEffect(() => {
    if (user?.role !== UserRole.Administrator) return;
    getTeamsThatCanBeAddedToCompetition();
  }, []);

  const resetForm = () => setTeamId(undefined);

  const getTeamsThatCanBeAddedToCompetition = useCallback(
    () => requests.getTeamsThatCanBeAddedToCompetitionRequest({ id }, (data: any) => setTeams(data)),
    [id]
  );

  const registerTeamRequest = useCallback(
    () =>
      requests.registerCompetitorToCompetitionAdminRequest({ id, auxId: teamId }, (_: any) => {
        handleReload();
        closeDialog();
        resetForm();
      }),
    [id, teamId]
  );

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
      <Autocomplete
        disablePortal
        autoHighlight
        options={teams}
        getOptionLabel={(team) => team.name}
        filterOptions={(x) => x}
        onChange={(_, value) => setTeamId(value?.id)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Team"
            required
          />
        )}
      />
    </DialogBase>
  );
};
