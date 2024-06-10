import { Autocomplete, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { CompetitionDisplayDTO } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface RegisterPlayerDialogProps extends BaseDialogProps {
  id: string;
}

export const RegisterPlayerDialog: FC<RegisterPlayerDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
  id,
}: RegisterPlayerDialogProps) => {
  const { user, requests } = useContext(AppContext);
  const [players, setPlayers] = useState<CompetitionDisplayDTO[]>([]);
  const [playerId, setPlayerId] = useState<string>();

  useEffect(() => {
    if (user?.role !== UserRole.Administrator) return;
    getPlayersNotInCompetition();
  }, []);

  const resetForm = () => setPlayerId(undefined);

  const getPlayersNotInCompetition = useCallback(
    () => requests.getPlayersNotInCompetitionRequest({ id }, (data: any) => setPlayers(data)),
    [id]
  );

  const registerPlayerRequest = useCallback(
    () =>
      requests.registerCompetitorToCompetitionAdminRequest({ id, auxId: playerId }, (_: any) => {
        handleReload();
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
