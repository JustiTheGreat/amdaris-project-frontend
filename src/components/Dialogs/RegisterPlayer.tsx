import { Autocomplete, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../App/App";
import { DialogBase } from "./DialogBase";
import { UserRole } from "../../utils/UserRoles";
import { CompetitionDisplayDTO } from "../../utils/Types";

interface RegisterPlayerDialogProps {
  dialogIsOpen: boolean;
  closeDialog: () => void;
  id: string;
}

export const RegisterPlayerDialog: FC<RegisterPlayerDialogProps> = ({
  id,
  dialogIsOpen,
  closeDialog,
}: RegisterPlayerDialogProps) => {
  const { user, requests, doReload } = useContext(AppContext);
  const [players, setPlayers] = useState<CompetitionDisplayDTO[]>([]);
  const [playerId, setPlayerId] = useState<string>();

  useEffect(() => {
    if (user?.role !== UserRole.Administrator) return;
    getPlayersNotInCompetition();
  }, []);

  const resetForm = () => setPlayerId(undefined);

  const getPlayersNotInCompetition = useCallback(
    () => requests.getPlayersNotInCompetitionRequest({ id }, (data: any) => setPlayers(data.items)),
    [id]
  );

  const registerPlayerRequest = useCallback(
    () =>
      requests.registerCompetitorToCompetitionAdminRequest({ id, auxId: playerId }, (_: any) => {
        doReload();
        closeDialog();
        resetForm();
      }),
    [id, playerId]
  );

  return (
    <DialogBase
      title={"Register player"}
      open={dialogIsOpen}
      doAction={{ name: "Register", handle: registerPlayerRequest }}
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
          />
        )}
      />
    </DialogBase>
  );
};
