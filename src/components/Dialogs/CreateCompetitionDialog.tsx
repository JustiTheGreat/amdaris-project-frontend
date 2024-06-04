import { Autocomplete, MenuItem, TextField } from "@mui/material/";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { FC, useContext, useEffect, useState } from "react";
import { PaginatedRequest } from "../../utils/PageConstants";
import { GameFormatGetDTO, SortDirection } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { DialogBase } from "./DialogBase";

export const CreateCompetitionDialog: FC = () => {
  const enum CompetitionType {
    ONE_VS_ALL = "ONE VS ALL",
    TOURNAMENT = "TOURNAMENT",
  }
  const { user, requests, createDialogIsOpen, closeCreateDialog, doReload } = useContext(AppContext);
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs(new Date()));
  const [gameFormat, setGameFormat] = useState<GameFormatGetDTO>();
  const [breakInMinutes, setBreakInMinutes] = useState<number | null>(null);
  const [oldBreakInMinutes, setOldBreakInMinutes] = useState<number>(1);
  const [competitionType, setCompetitionType] = useState<CompetitionType>();
  const [gameFormatList, setGameFormatList] = useState<GameFormatGetDTO[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => (breakInMinutes ? setOldBreakInMinutes(breakInMinutes) : undefined), [breakInMinutes]);

  useEffect(() => getGameFormats(), [filter]);

  const resetForm = () => {
    setName("");
    setLocation("");
    setStartTime(dayjs(new Date()));
    setGameFormat(undefined);
    setBreakInMinutes(1);
    setCompetitionType(undefined);
  };

  const getGameFormats = () => {
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

    requests.getGameFormatsRequest({ requestBody: paginatedRequest }, (response: string) =>
      setGameFormatList(JSON.parse(response).items)
    );
  };

  const createRequest = () => {
    const data = {
      name,
      location,
      startTime,
      gameFormat: gameFormat?.id,
      breakInMinutes,
    };

    const callback = (_: string) => {
      doReload();
      closeCreateDialog();
      resetForm();
    };

    competitionType === CompetitionType.ONE_VS_ALL
      ? requests.createOneVsAllCompetitionRequest({ requestBody: data }, callback)
      : requests.createTournamentCompetitionRequest({ requestBody: data }, callback);
  };

  return (
    <DialogBase
      title="Create competition"
      open={createDialogIsOpen}
      doAction={{ name: "Create", handle: createRequest }}
      handleClose={() => {
        closeCreateDialog();
        resetForm();
      }}
    >
      <TextField
        label={"Competition name"}
        required
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <TextField
        label={"Location"}
        required
        value={location}
        onChange={(event) => setLocation(event.currentTarget.value)}
      />
      <DateTimePicker
        disablePast
        value={startTime}
        onChange={(value) => setStartTime(value)}
      />
      <Autocomplete
        disablePortal
        autoHighlight
        options={gameFormatList}
        getOptionLabel={(gameFormat) => gameFormat.name}
        filterOptions={(x) => x}
        onChange={(_, value) => {
          setBreakInMinutes(gameFormat?.durationInMinutes ? oldBreakInMinutes : null);
          setGameFormat(value ? value : undefined);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Game format"
            required
            onChange={(event) => setFilter(event.currentTarget.value)}
          />
        )}
      />
      <TextField
        type="number"
        label={"Break time (min)"}
        required
        disabled={!Boolean(gameFormat?.durationInMinutes)}
        defaultValue={1}
        value={breakInMinutes}
        onChange={(event) => {
          const number = Number(event.currentTarget.value);
          setBreakInMinutes(number < 1 ? 1 : number);
        }}
      />
      <TextField
        select
        label={"Competition type"}
        required
        onChange={(event) => setCompetitionType(event.target.value as CompetitionType)}
      >
        <MenuItem value={CompetitionType.ONE_VS_ALL}>{CompetitionType.ONE_VS_ALL}</MenuItem>
        <MenuItem value={CompetitionType.TOURNAMENT}>{CompetitionType.TOURNAMENT}</MenuItem>
      </TextField>
    </DialogBase>
  );
};
