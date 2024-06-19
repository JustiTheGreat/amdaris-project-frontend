import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { PaginatedRequest } from "../../utils/PageConstants";
import { CompetitionType, GameFormatGetDTO, SortDirection } from "../../utils/Types";
import { useValidation } from "../../utils/UseValidation";
import { UserRole } from "../../utils/UserRoles";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface CreateCompetitionDialogProps extends BaseDialogProps {}

export const CreateCompetitionDialog: FC<CreateCompetitionDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
}: CreateCompetitionDialogProps) => {
  const { user, requests } = useContext(AppContext);
  const [oldBreakInMinutes, setOldBreakInMinutes] = useState<number>(1);
  const [gameFormatList, setGameFormatList] = useState<GameFormatGetDTO[]>([]);
  const [filter, setFilter] = useState("");

  const name = "name";
  const location = "location";
  const startTime = "startTime";
  const gameFormat = "gameFormat";
  const breakInMinutes = "breakInMinutes";
  const competitionType = "competitionType";

  const validation = useValidation(
    [
      {
        name: name,
        defaultValue: "",
        conditions: [{ expression: (value: any) => value.trim() === "", errorMessage: "Name is required!" }],
      },
      {
        name: location,
        defaultValue: "",
        conditions: [{ expression: (value: any) => value.trim() === "", errorMessage: "Location is required!" }],
      },
      {
        name: startTime,
        defaultValue: undefined,
        conditions: [
          {
            expression: (value: any) => value === undefined,
            errorMessage: "Choose a start time!",
          },
          {
            expression: (value: any) => !value || value < dayjs(Date()),
            errorMessage: "The chosen start time passed!",
          },
        ],
      },
      {
        name: gameFormat,
        defaultValue: undefined,
        conditions: [{ expression: (value: any) => value === undefined, errorMessage: "Choose a game format!" }],
      },
      {
        name: breakInMinutes,
        defaultValue: null,
        conditions: [],
      },
      {
        name: competitionType,
        defaultValue: undefined,
        conditions: [
          { expression: (value: any) => value === undefined, errorMessage: "Choose the type of the competition!" },
        ],
      },
    ],
    []
  );

  useEffect(
    () =>
      validation.errors[breakInMinutes]?.value
        ? setOldBreakInMinutes(validation.errors[breakInMinutes]?.value)
        : undefined,
    [validation.errors[breakInMinutes]?.value]
  );

  useEffect(() => getGameFormats(), [filter]);

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

    requests.getGameFormatsRequest({ requestBody: paginatedRequest }, (data: any) => setGameFormatList(data.items));
  };

  const resetFrom = () => {
    validation.reset();
    setOldBreakInMinutes(1);
  };

  const createRequest = useCallback(() => {
    if (!validation.pass()) return;
    const data: { [x: string]: any } = {
      ...validation.getData(),
      [gameFormat]: validation.errors[gameFormat].value.id,
    };
    const callback = (_: any) => {
      handleReload();
      closeDialog();
      resetFrom();
    };

    data[competitionType] === CompetitionType.ONE_VS_ALL
      ? requests.createOneVsAllCompetitionRequest({ requestBody: data }, callback)
      : requests.createTournamentCompetitionRequest({ requestBody: data }, callback);
  }, [validation]);

  return (
    <DialogBase
      title="Create competition"
      open={dialogIsOpen}
      doAction={{ name: "Create", handle: createRequest }}
      handleClose={() => {
        closeDialog();
        resetFrom();
      }}
    >
      <Box>
        <TextField
          fullWidth
          label={"Competition name"}
          required
          value={validation.errors[name]?.value}
          error={Boolean(validation.errors[name]?.error)}
          onChange={(event) => validation.setFieldValue(name, event.currentTarget.value)}
        />
        <FormErrorMessage>{validation.errors[name]?.error}</FormErrorMessage>
      </Box>
      <Box>
        <TextField
          fullWidth
          label={"Location"}
          required
          value={validation.errors[location]?.value}
          error={Boolean(validation.errors[location]?.error)}
          onChange={(event) => validation.setFieldValue(location, event.currentTarget.value)}
        />
        <FormErrorMessage>{validation.errors[location]?.error}</FormErrorMessage>
      </Box>
      <Box>
        <DateTimePicker
          sx={{ width: "100%" }}
          disablePast
          value={validation.errors[startTime]?.value}
          onChange={(value) => validation.setFieldValue(startTime, value)}
          slotProps={{ textField: { error: Boolean(validation.errors[location]?.error) } }}
        />
        <FormErrorMessage>{validation.errors[startTime]?.error}</FormErrorMessage>
      </Box>
      <Box>
        <Autocomplete
          fullWidth
          autoHighlight
          options={gameFormatList}
          getOptionLabel={(gameFormat) => gameFormat.name}
          filterOptions={(x) => x}
          onChange={(_, value) =>
            validation.setFieldValues([
              { field: gameFormat, value: value ? value : undefined },
              {
                field: breakInMinutes,
                value: value?.durationInMinutes ? oldBreakInMinutes : null,
              },
            ])
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Game format"
              required
              error={Boolean(validation.errors[gameFormat]?.error)}
              onChange={(event) => setFilter(event.currentTarget.value)}
            />
          )}
        />
        <FormErrorMessage>{validation.errors[gameFormat]?.error}</FormErrorMessage>
      </Box>
      <Box>
        <TextField
          fullWidth
          type="number"
          label={"Break time (min)"}
          required
          disabled={!Boolean(validation.errors[gameFormat]?.value?.durationInMinutes)}
          defaultValue={1}
          value={oldBreakInMinutes}
          error={Boolean(validation.errors[breakInMinutes]?.error)}
          onChange={(event) => {
            const number = Number(event.currentTarget.value);
            validation.setFieldValue(breakInMinutes, number < 1 ? 1 : number);
          }}
        />
        <FormErrorMessage>{validation.errors[breakInMinutes]?.error}</FormErrorMessage>
      </Box>
      <Box>
        <TextField
          fullWidth
          select
          label={"Competition type"}
          required
          error={Boolean(validation.errors[competitionType]?.error)}
          onChange={(event) => validation.setFieldValue(competitionType, event.target.value)}
        >
          <MenuItem value={CompetitionType.ONE_VS_ALL}>{CompetitionType.ONE_VS_ALL}</MenuItem>
          <MenuItem value={CompetitionType.TOURNAMENT}>{CompetitionType.TOURNAMENT}</MenuItem>
        </TextField>
        <FormErrorMessage>{validation.errors[competitionType]?.error}</FormErrorMessage>
      </Box>
    </DialogBase>
  );
};
