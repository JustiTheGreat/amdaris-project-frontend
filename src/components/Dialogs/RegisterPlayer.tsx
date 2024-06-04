import { Autocomplete, TextField } from "@mui/material/";
import { FC, useContext, useEffect, useState } from "react";
import { PlayerDisplayDTO } from "../../utils/Types";
import { AppContext } from "../App/App";
import { DialogBase } from "./DialogBase";
import { UserRole } from "../../utils/UserRoles";

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
  const [player, setPlayer] = useState<PlayerDisplayDTO>();
  const [players, setPlayers] = useState<PlayerDisplayDTO[]>([]);

  useEffect(() => {
    if (user?.role !== UserRole.Administrator) return;
    getPlayersNotInCompetition();
  }, []);

  const resetForm = () => {
    setPlayer(undefined);
  };

  const getPlayersNotInCompetition = () =>
    requests.getPlayersNotInCompetitionRequest({ id }, (response: string) => setPlayers(JSON.parse(response).items));

  const registerRequest = () => {
    if (!player) return;
    requests.registerCompetitorToCompetitionAdminRequest({ id, auxId: player.id }, (_: string) => {
      doReload();
      closeDialog();
      resetForm();
    });
  };

  return (
    <DialogBase
      title={"Register player"}
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
        options={players}
        getOptionLabel={(player) => player.name}
        filterOptions={(x) => x}
        onChange={(_, value) => setPlayer(value ?? undefined)}
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
