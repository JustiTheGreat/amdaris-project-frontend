import { Autocomplete, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { CompetitionDisplayDTO } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface RegisterTeamMemberDialogProps extends BaseDialogProps {
  id: string;
}

export const RegisterTeamMemberDialog: FC<RegisterTeamMemberDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
  id,
}: RegisterTeamMemberDialogProps) => {
  const { user, requests } = useContext(AppContext);
  const [players, setPlayers] = useState<CompetitionDisplayDTO[]>([]);
  const [playerId, setPlayerId] = useState<string>();

  useEffect(() => {
    if (user?.role !== UserRole.Administrator) return;
    getPlayersNotInTeam();
  }, []);

  const resetForm = () => setPlayerId(undefined);

  const getPlayersNotInTeam = useCallback(
    () => requests.getPlayersNotInTeamRequest({ id }, (data: any) => setPlayers(data)),
    [id]
  );

  const addPlayerToTeam = useCallback(
    () =>
      requests.addPlayerToTeamAdminRequest({ id, auxId: playerId }, (_: any) => {
        handleReload();
        closeDialog();
        resetForm();
      }),
    [id, playerId]
  );

  return (
    <DialogBase
      title={"Add team member"}
      open={dialogIsOpen}
      doAction={{ name: "Add", handle: addPlayerToTeam }}
      handleClose={() => {
        closeDialog();
        resetForm();
      }}
    >
      <Autocomplete
        disablePortal
        autoHighlight
        options={players}
        getOptionLabel={(player) => player.name}
        filterOptions={(x) => x}
        onChange={(_, value) => setPlayerId(value?.id ?? undefined)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Player"
            required
            onChange={() => {}}
          />
        )}
      />
    </DialogBase>
  );
};
