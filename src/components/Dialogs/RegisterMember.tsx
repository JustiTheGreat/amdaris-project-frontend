import { Autocomplete, TextField } from "@mui/material/";
import { FC, useContext, useEffect, useState } from "react";
import { PlayerDisplayDTO } from "../../utils/Types";
import { AppContext } from "../App/App";
import { DialogBase } from "./DialogBase";
import { UserRole } from "../../utils/UserRoles";

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
  const [player, setPlayer] = useState<PlayerDisplayDTO>();
  const [players, setPlayers] = useState<PlayerDisplayDTO[]>([]);

  useEffect(() => {
    if (user?.role !== UserRole.Administrator) return;
    getPlayersNotInTeam();
  }, []);

  const resetForm = () => {
    setPlayer(undefined);
  };

  const getPlayersNotInTeam = () =>
    requests.getPlayersNotInTeamRequest({ id }, (response: string) => setPlayers(JSON.parse(response).items));

  const addPlayerToTeam = () => {
    if (!player) return;
    requests.addPlayerToTeamAdminRequest({ id, auxId: player.id }, (_: string) => {
      doReload();
      closeDialog();
      resetForm();
    });
  };

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
