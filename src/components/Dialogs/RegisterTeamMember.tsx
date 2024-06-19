import { Autocomplete, Box, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { CompetitionDisplayDTO } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { BaseDialogProps, DialogBase } from "./DialogBase";
import { useValidation } from "../../utils/UseValidation";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";

interface RegisterTeamMemberDialogProps extends BaseDialogProps {
  id: string;
  reloadDialogData: boolean;
}

export const RegisterTeamMemberDialog: FC<RegisterTeamMemberDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
  id,
  reloadDialogData,
}: RegisterTeamMemberDialogProps) => {
  const { user, requests } = useContext(AppContext);
  const [players, setPlayers] = useState<CompetitionDisplayDTO[]>([]);

  const playerId = "playerId";

  const validation = useValidation(
    [
      {
        name: playerId,
        defaultValue: undefined,
        conditions: [{ expression: (value: any) => value === undefined, errorMessage: "Select a player!" }],
      },
    ],
    []
  );

  useEffect(() => {
    if (user?.role !== UserRole.Administrator) return;
    getPlayersNotInTeam();
  }, [reloadDialogData]);

  const resetForm = () => validation.setFieldValue(playerId, undefined);

  const getPlayersNotInTeam = useCallback(
    () => requests.getPlayersNotInTeamRequest({ id }, (data: any) => setPlayers(data)),
    [id]
  );

  const addPlayerToTeam = useCallback(() => {
    if (!validation.pass()) return;
    const data = validation.getData();
    requests.addPlayerToTeamAdminRequest({ id, auxId: data[playerId] }, (_: any) => {
      handleReload();
      closeDialog();
      resetForm();
    });
  }, [id, validation]);

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
      <Box>
        <Autocomplete
          autoHighlight
          options={players}
          getOptionLabel={(player) => player.name}
          filterOptions={(x) => x}
          onChange={(_, value) => validation.setFieldValue(playerId, value?.id)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Player"
              error={Boolean(validation.errors[playerId]?.error)}
            />
          )}
        />
        <FormErrorMessage>{validation.errors[playerId]?.error}</FormErrorMessage>
      </Box>
    </DialogBase>
  );
};
