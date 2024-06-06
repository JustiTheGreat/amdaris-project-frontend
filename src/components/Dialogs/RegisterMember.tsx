import { Autocomplete, TextField } from "@mui/material/";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../App/App";
import { DialogBase } from "./DialogBase";
import { UserRole } from "../../utils/UserRoles";
import { CompetitionDisplayDTO } from "../../utils/Types";

interface RegisterMemberDialogProps {
  dialogIsOpen: boolean;
  closeDialog: () => void;
  id: string;
}

export const RegisterMemberDialog: FC<RegisterMemberDialogProps> = ({
  id,
  dialogIsOpen,
  closeDialog,
}: RegisterMemberDialogProps) => {
  const { user, requests, doReload } = useContext(AppContext);
  const [players, setPlayers] = useState<CompetitionDisplayDTO[]>([]);
  const [playerId, setPlayerId] = useState<string>();

  useEffect(() => {
    if (user?.role !== UserRole.Administrator) return;
    getPlayersNotInTeam();
  }, []);

  const resetForm = () => setPlayerId(undefined);

  const getPlayersNotInTeam = useCallback(
    () => requests.getPlayersNotInTeamRequest({ id }, (response: string) => setPlayers(JSON.parse(response).items)),
    [id]
  );

  const addPlayerToTeam = useCallback(
    () =>
      requests.addPlayerToTeamAdminRequest({ id, auxId: playerId }, (_: string) => {
        doReload();
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
