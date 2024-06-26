import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { PaginatedRequest } from "../../utils/PageConstants";
import { CompetitorDisplayDTO, SortDirection } from "../../utils/Types";
import { useValidation } from "../../utils/UseValidation";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { BaseDialogProps, DialogBase } from "./DialogBase";
import { ProfilePictureContainer } from "../PictureContainer/ProfilePictureContainer";

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
  const [players, setPlayers] = useState<CompetitorDisplayDTO[]>([]);
  const [filter, setFilter] = useState<string>("");

  const playerId = "playerId";

  const validation = useValidation(
    [
      {
        name: playerId,
        defaultValue: undefined,
        conditions: [
          { expression: (value: string | undefined) => value === undefined, errorMessage: "Select a player!" },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (user?.role !== UserRole.Administrator || !dialogIsOpen) return;
    const paginatedRequest: PaginatedRequest = {
      pageIndex: 0,
      pageSize: 5,
      columnNameForSorting: "name",
      sortDirection: SortDirection.ASCENDING,
      requestFilters: {
        logicalOperator: 0,
        filters: [
          {
            path: "name",
            value: filter,
          },
        ],
      },
    };

    requests.getPlayersNotInCompetitionRequest({ id, requestBody: paginatedRequest }, (data: any) =>
      setPlayers(data.items)
    );
  }, [dialogIsOpen, filter, reloadDialogData]);

  const resetForm = () => {
    validation.reset();
    setFilter("");
  };

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
      handleClose={() => {
        closeDialog();
        resetForm();
      }}
      buttons={[<Button onClick={registerPlayerRequest}>Register</Button>]}
    >
      <Box>
        <Autocomplete
          autoHighlight
          options={players}
          getOptionLabel={(player) => player.name}
          filterOptions={(x) => x}
          onChange={(_, value) => validation.setFieldValue(playerId, value?.id)}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ display: "flex", gap: (theme) => theme.spacing(2) }}
              {...props}
            >
              <ProfilePictureContainer src={option.profilePicture} />
              {option.name}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Player"
              value={filter}
              error={Boolean(validation.errors[playerId]?.error)}
              onChange={(event) => setFilter(event.currentTarget.value)}
            />
          )}
        />
        <FormErrorMessage>{validation.errors[playerId]?.error}</FormErrorMessage>
      </Box>
    </DialogBase>
  );
};
