import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { PaginatedRequest } from "../../utils/PageConstants";
import { CompetitionDisplayDTO, SortDirection } from "../../utils/Types";
import { useValidation } from "../../utils/UseValidation";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface RegisterTeamToCompetitionDialogProps extends BaseDialogProps {
  id: string;
  reloadDialogData: boolean;
}

export const RegisterTeamToCompetitionDialog: FC<RegisterTeamToCompetitionDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
  id,
  reloadDialogData,
}: RegisterTeamToCompetitionDialogProps) => {
  const { user, requests } = useContext(AppContext);
  const [teams, setTeams] = useState<CompetitionDisplayDTO[]>([]);
  const [filter, setFilter] = useState<string>("");

  const teamId = "teamId";

  const validation = useValidation(
    [
      {
        name: teamId,
        defaultValue: undefined,
        conditions: [
          { expression: (value: string | undefined) => value === undefined, errorMessage: "Select a Team!" },
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

    requests.getTeamsThatCanBeAddedToCompetitionRequest({ id, requestBody: paginatedRequest }, (data: any) =>
      setTeams(data.items)
    );
  }, [dialogIsOpen, filter, reloadDialogData]);

  const resetForm = () => {
    validation.reset();
    setFilter("");
  };

  const registerTeamRequest = useCallback(() => {
    if (!validation.pass()) return;
    const data = validation.getData();
    requests.registerCompetitorToCompetitionAdminRequest({ id, auxId: data[teamId] }, (_: any) => {
      handleReload();
      closeDialog();
      resetForm();
    });
  }, [id, validation]);

  return (
    <DialogBase
      title={"Register team"}
      open={dialogIsOpen}
      handleClose={() => {
        closeDialog();
        resetForm();
      }}
      buttons={[<Button onClick={registerTeamRequest}>Register</Button>]}
    >
      <Box>
        <Autocomplete
          autoHighlight
          options={teams}
          getOptionLabel={(team) => team.name}
          filterOptions={(x) => x}
          onChange={(_, value) => validation.setFieldValue(teamId, value?.id)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Team"
              value={filter}
              error={Boolean(validation.errors[teamId]?.error)}
              onChange={(event) => setFilter(event.currentTarget.value)}
            />
          )}
        />
        <FormErrorMessage>{validation.errors[teamId]?.error}</FormErrorMessage>
      </Box>
    </DialogBase>
  );
};
