import { Autocomplete, Box, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { CompetitionDisplayDTO } from "../../utils/Types";
import { useValidation } from "../../utils/UseValidation";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface RegisterPlayerToCompetitionDialogProps extends BaseDialogProps {
  id: string;
  reloadDialogData: boolean;
}

export const RegisterPlayerToCompetitionDialog: FC<RegisterPlayerToCompetitionDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
  id,
  reloadDialogData,
}: RegisterPlayerToCompetitionDialogProps) => {
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
    getPlayersNotInCompetition();
  }, [reloadDialogData]);

  const resetForm = () => validation.setFieldValue(playerId, undefined);

  const getPlayersNotInCompetition = useCallback(
    () => requests.getPlayersNotInCompetitionRequest({ id }, (data: any) => setPlayers(data)),
    [id]
  );

  const registerPlayerRequest = useCallback(() => {
    if (!validation.pass()) return;
    const data = validation.getData();
    requests.registerCompetitorToCompetitionAdminRequest({ id, auxId: data[playerId] }, (_: any) => {
      handleReload();
      closeDialog();
      resetForm();
    });
  }, [id, validation]);

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
