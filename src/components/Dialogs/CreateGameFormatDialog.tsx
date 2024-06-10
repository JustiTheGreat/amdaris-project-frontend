import { Autocomplete, Box, Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { PaginatedRequest } from "../../utils/PageConstants";
import { CompetitorType, GameTypeGetDTO, SortDirection } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface CreateGameFormatDialogProps extends BaseDialogProps {}

export const CreateGameFormatDialog: FC<CreateGameFormatDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
}: CreateGameFormatDialogProps) => {
  const { user, requests, setAlertMessage } = useContext(AppContext);
  const [name, setName] = useState<string>("");
  const [gameType, setGameType] = useState<string>("");
  const [competitorType, setCompetitorType] = useState<CompetitorType>();
  const [teamSize, setTeamSize] = useState<number | null>(null);
  const [winAt, setWinAt] = useState<number | null>(null);
  const [oldWinAt, setOldWinAt] = useState<number>(1);
  const [durationInMinutes, setDurationInMinutes] = useState<number | null>(null);
  const [oldDurationInMinutes, setOldDurationInMinutes] = useState<number>(1);
  const [gameTypeList, setGameTypeList] = useState<GameTypeGetDTO[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => (winAt ? setOldWinAt(winAt) : undefined), [winAt]);

  useEffect(() => (durationInMinutes ? setOldDurationInMinutes(durationInMinutes) : undefined), [durationInMinutes]);

  useEffect(() => getGameTypeList(), [filter]);

  const resetForm = () => {
    setName("");
    setGameType("");
    setCompetitorType(undefined);
    setTeamSize(null);
    setWinAt(null);
    setDurationInMinutes(null);
    setOldWinAt(1);
    setOldDurationInMinutes(1);
  };

  const getGameTypeList = () => {
    if (user?.role !== UserRole.Administrator) return;

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
  };

  const createRequest = useCallback(() => {
    if (name.trim() === "") {
      setAlertMessage("Name is required!");
      return;
    }

    if (gameType.trim() === "") {
      setAlertMessage("Choose the type of the game!");
      return;
    }

    if (competitorType === undefined) {
      setAlertMessage("Choose the type of the competitor!");
      return;
    }

    if (competitorType === CompetitorType.TEAM && teamSize === null) {
      setAlertMessage("Choose the size of a team!");
      return;
    }

    if (!winAt && !durationInMinutes) {
      setAlertMessage("Choose at least one match end criteria: score or duration!");
      return;
    }

    const data = {
      name,
      gameType,
      competitorType: competitorType === CompetitorType.PLAYER ? 0 : 1,
      teamSize,
      winAt,
      durationInMinutes,
    };

    requests.createGameFormatRequest({ requestBody: data }, (_: any) => {
      handleReload();
      closeDialog();
      resetForm();
    });
  }, [name, gameType, competitorType, teamSize, winAt, durationInMinutes]);

  return (
    <DialogBase
      title={"Create game format"}
      open={dialogIsOpen}
      doAction={{ name: "Create", handle: createRequest }}
      handleClose={() => {
        closeDialog();
        resetForm();
      }}
    >
      <TextField
        label={"Game format name"}
        required
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <Autocomplete
        disablePortal
        autoHighlight
        options={gameTypeList}
        getOptionLabel={(gameType) => gameType.name}
        filterOptions={(x) => x}
        onChange={(_, value) => setGameType(value ? value.id : "")}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Game type"
            required
            onChange={(event) => setFilter(event.currentTarget.value)}
          />
        )}
      />
      <TextField
        select
        label={"Competitor type"}
        required
        onChange={(event) => setCompetitorType(event.target.value as CompetitorType)}
      >
        <MenuItem value={CompetitorType.PLAYER}>{CompetitorType.PLAYER}</MenuItem>
        <MenuItem value={CompetitorType.TEAM}>{CompetitorType.TEAM}</MenuItem>
      </TextField>
      <TextField
        type="number"
        label={"Team size"}
        required
        disabled={competitorType != CompetitorType.TEAM}
        value={teamSize}
        onChange={(event) => {
          const number = Number(event.currentTarget.value);
          setTeamSize(number < 2 ? 2 : number);
        }}
      />
      <Box sx={{ display: "flex" }}>
        <FormControlLabel
          sx={{ flex: 1 }}
          control={
            <Checkbox
              value={Boolean(winAt)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setWinAt(event.currentTarget.checked ? oldWinAt : null)
              }
            />
          }
          label={"Win match at score"}
        />
        <TextField
          sx={{ flex: 1 }}
          type="number"
          label={"Win match at score"}
          required
          disabled={!Boolean(winAt)}
          defaultValue={1}
          value={oldWinAt}
          onChange={(event) => {
            const number = Number(event.currentTarget.value);
            setWinAt(number < 1 ? 1 : number);
          }}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <FormControlLabel
          sx={{ flex: 1 }}
          control={
            <Checkbox
              value={Boolean(durationInMinutes)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setDurationInMinutes(event.currentTarget.checked ? oldDurationInMinutes : null)
              }
            />
          }
          label={"Timed matches"}
        />
        <TextField
          sx={{ flex: 1 }}
          type="number"
          label={"Match duration (min)"}
          required
          disabled={!Boolean(durationInMinutes)}
          defaultValue={1}
          value={oldDurationInMinutes}
          onChange={(event) => {
            const number = Number(event.currentTarget.value);
            setDurationInMinutes(number < 1 ? 1 : number);
          }}
        />
      </Box>
    </DialogBase>
  );
};
