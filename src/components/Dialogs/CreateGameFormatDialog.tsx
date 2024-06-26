import { Autocomplete, Box, Button, Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { PaginatedRequest } from "../../utils/PageConstants";
import { CompetitorType, GameTypeGetDTO, SortDirection } from "../../utils/Types";
import { useValidation } from "../../utils/UseValidation";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface CreateGameFormatDialogProps extends BaseDialogProps {}

export const CreateGameFormatDialog: FC<CreateGameFormatDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
}: CreateGameFormatDialogProps) => {
  const { user, requests } = useContext(AppContext);
  const [oldTeamSize, setOldTeamSize] = useState<number>(2);
  const [oldWinAt, setOldWinAt] = useState<number>(1);
  const [oldDurationInMinutes, setOldDurationInMinutes] = useState<number>(1);
  const [gameTypeList, setGameTypeList] = useState<GameTypeGetDTO[]>([]);
  const [filter, setFilter] = useState<string>("");
  const durationInMinutesCheckbox = useRef<any>();

  const name = "name";
  const gameType = "gameType";
  const competitorType = "competitorType";
  const teamSize = "teamSize";
  const winAt = "winAt";
  const durationInMinutes = "durationInMinutes";

  const validation = useValidation(
    [
      {
        name: name,
        defaultValue: "",
        conditions: [{ expression: (value: string) => value.trim() === "", errorMessage: "Name is required!" }],
      },
      {
        name: gameType,
        defaultValue: undefined,
        conditions: [
          { expression: (value: string | undefined) => value === undefined, errorMessage: "Choose a game type!" },
        ],
      },
      {
        name: competitorType,
        defaultValue: undefined,
        conditions: [
          {
            expression: (value: string | undefined) => value === undefined,
            errorMessage: "Choose the competitor type!",
          },
        ],
      },
      {
        name: teamSize,
        defaultValue: null,
        conditions: [],
      },
      {
        name: winAt,
        defaultValue: null,
        conditions: [],
      },
      {
        name: durationInMinutes,
        defaultValue: null,
        conditions: [],
      },
    ],
    []
  );
  const [atLeastOneMatchWinCriteriaIsSelected, setAtLeastOneMatchWinCriteriaIsSelected] = useState<boolean>(true);

  useEffect(
    () => (validation.errors[teamSize]?.value ? setOldTeamSize(validation.errors[teamSize]?.value) : undefined),
    [validation.errors[teamSize]?.value]
  );

  useEffect(
    () => (validation.errors[winAt]?.value ? setOldWinAt(validation.errors[winAt]?.value) : undefined),
    [validation.errors[winAt]?.value]
  );

  useEffect(
    () =>
      validation.errors[durationInMinutes]?.value
        ? setOldDurationInMinutes(validation.errors[durationInMinutes]?.value)
        : undefined,
    [validation.errors[durationInMinutes]?.value]
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

    requests.getGameTypesRequest({ requestBody: paginatedRequest }, (data: any) => setGameTypeList(data.items));
  }, [dialogIsOpen, filter]);

  const resetForm = () => {
    validation.reset();
    setOldTeamSize(2);
    setOldWinAt(1);
    setOldDurationInMinutes(1);
    setFilter("");
  };

  const createRequest = useCallback(() => {
    const atLeastOneMatchWinCriteriaIsSelected =
      validation.errors[winAt]?.value !== null || validation.errors[durationInMinutes]?.value !== null;
    if (!atLeastOneMatchWinCriteriaIsSelected) setAtLeastOneMatchWinCriteriaIsSelected(false);
    if (!validation.pass() || !atLeastOneMatchWinCriteriaIsSelected) return;
    const data = {
      ...validation.getData(),
      [competitorType]: validation.errors[competitorType].value === CompetitorType.PLAYER ? 0 : 1,
    };

    requests.createGameFormatRequest({ requestBody: data }, (_: any) => {
      handleReload();
      closeDialog();
      resetForm();
    });
  }, [validation]);

  return (
    <DialogBase
      title={"Create game format"}
      open={dialogIsOpen}
      handleClose={() => {
        closeDialog();
        resetForm();
      }}
      buttons={[<Button onClick={createRequest}>Create</Button>]}
    >
      <Box>
        <TextField
          fullWidth
          label={"Game format name"}
          required
          value={validation.errors[name]?.value}
          error={Boolean(validation.errors[name]?.error)}
          onChange={(event) => validation.setFieldValue(name, event.currentTarget.value)}
        />
        <FormErrorMessage>{validation.errors[name]?.error}</FormErrorMessage>
      </Box>
      <Box>
        <Autocomplete
          fullWidth
          autoHighlight
          options={gameTypeList}
          getOptionLabel={(gameType) => gameType.name}
          filterOptions={(x) => x}
          onChange={(_, value) => validation.setFieldValue(gameType, value ? value.id : undefined)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Game type"
              required
              value={filter}
              error={Boolean(validation.errors[gameType]?.error)}
              onChange={(event) => setFilter(event.currentTarget.value)}
            />
          )}
        />
        <FormErrorMessage>{validation.errors[gameType]?.error}</FormErrorMessage>
      </Box>
      <Box>
        <Box sx={{ display: "flex", gap: (theme) => theme.spacing(1) }}>
          <TextField
            sx={{ flex: 1 }}
            select
            label={"Competitor type"}
            required
            error={Boolean(validation.errors[competitorType]?.error)}
            onChange={(event) => {
              validation.setFieldValues([
                { field: competitorType, value: event.target.value },
                {
                  field: teamSize,
                  value: validation.errors[teamSize]?.value ? oldTeamSize : null,
                },
              ]);
            }}
          >
            <MenuItem value={CompetitorType.PLAYER}>{CompetitorType.PLAYER}</MenuItem>
            <MenuItem value={CompetitorType.TEAM}>{CompetitorType.TEAM}</MenuItem>
          </TextField>
          <TextField
            sx={{ flex: 1 }}
            type="number"
            label={"Team size"}
            required
            disabled={validation.errors[competitorType]?.value != CompetitorType.TEAM}
            value={oldTeamSize}
            error={Boolean(validation.errors[teamSize]?.error)}
            onChange={(event) => {
              const number = Number(event.currentTarget.value);
              validation.setFieldValue(teamSize, number < 2 ? 2 : number);
            }}
          />
        </Box>
        <FormErrorMessage>{validation.errors[competitorType]?.error}</FormErrorMessage>
      </Box>
      <Box>
        <Box sx={{ display: "flex", gap: (theme) => theme.spacing(1) }}>
          <FormControlLabel
            sx={{ flex: 1 }}
            control={
              <Checkbox
                value={Boolean(validation.errors[winAt]?.value)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  validation.setFieldValue(winAt, event.currentTarget.checked ? oldWinAt : null);
                  setAtLeastOneMatchWinCriteriaIsSelected(true);
                }}
              />
            }
            label={"Win match at score"}
            color={Boolean(validation.errors[winAt]?.error) ? "error.main" : "primary.main"}
          />
          <TextField
            sx={{ flex: 1 }}
            type="number"
            label={"Win match at score"}
            required
            disabled={!Boolean(validation.errors[winAt]?.value)}
            defaultValue={1}
            value={oldWinAt}
            onChange={(event) => {
              const number = Number(event.currentTarget.value);
              validation.setFieldValue(winAt, number < 1 ? 1 : number);
            }}
          />
        </Box>
      </Box>
      <Box>
        <Box sx={{ display: "flex", gap: (theme) => theme.spacing(1) }}>
          <FormControlLabel
            sx={{ flex: 1 }}
            control={
              <Checkbox
                ref={durationInMinutesCheckbox}
                value={Boolean(validation.errors[durationInMinutes]?.value)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  validation.setFieldValue(
                    durationInMinutes,
                    event.currentTarget.checked ? oldDurationInMinutes : null
                  );
                  setAtLeastOneMatchWinCriteriaIsSelected(true);
                }}
              />
            }
            label={"Timed matches"}
          />
          <TextField
            sx={{ flex: 1 }}
            type="number"
            label={"Match duration (min)"}
            required
            disabled={!Boolean(validation.errors[durationInMinutes]?.value)}
            defaultValue={1}
            value={oldDurationInMinutes}
            onChange={(event) => {
              const number = Number(event.currentTarget.value);
              validation.setFieldValue(durationInMinutes, number < 1 ? 1 : number);
            }}
          />
        </Box>
        <FormErrorMessage>
          {!atLeastOneMatchWinCriteriaIsSelected ? "Choose at least one match win criteria!" : ""}
        </FormErrorMessage>
      </Box>
    </DialogBase>
  );
};
