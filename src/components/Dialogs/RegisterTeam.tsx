import { Autocomplete, TextField } from "@mui/material/";
import { FC, useContext, useEffect, useState } from "react";
import { TeamDisplayDTO } from "../../utils/Types";
import { AppContext } from "../App/App";
import { DialogBase } from "./DialogBase";
import { UserRole } from "../../utils/UserRoles";

interface RegisterTeamDialogProps {
  dialogIsOpen: boolean;
  closeDialog: () => void;
  id: string;
}

export const RegisterTeamDialog: FC<RegisterTeamDialogProps> = ({
  id,
  dialogIsOpen,
  closeDialog,
}: RegisterTeamDialogProps) => {
  const { user, requests, doReload } = useContext(AppContext);
  const [team, setTeam] = useState<TeamDisplayDTO>();
  const [teams, setTeams] = useState<TeamDisplayDTO[]>([]);

  useEffect(() => {
    if (user?.role !== UserRole.Administrator) return;
    getTeamsThatCanBeAddedToCompetition();
  }, []);

  const resetForm = () => {
    setTeam(undefined);
  };

  const getTeamsThatCanBeAddedToCompetition = () =>
    requests.GetTeamsThatCanBeAddedToCompetitionRequest({ id }, (response: string) =>
      setTeams(JSON.parse(response).items)
    );

  const registerRequest = () => {
    if (!team) return;
    requests.registerCompetitorToCompetitionAdminRequest({ id, auxId: team.id }, (_: string) => {
      doReload();
      closeDialog();
      resetForm();
    });
  };

  return (
    <DialogBase
      title={"Register team"}
      open={dialogIsOpen}
      doAction={{ name: "Register", handle: registerRequest }}
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
        onChange={(_, value) => setTeam(value ?? undefined)}
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
