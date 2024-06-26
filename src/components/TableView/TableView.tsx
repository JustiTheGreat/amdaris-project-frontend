import { Search as SearchIcon } from "@mui/icons-material";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APRequestData } from "../../utils/PageConstants";
import { IdDTO, SortDirection } from "../../utils/Types";
import { formatDate, formatKeyToSpacedLowercase } from "../../utils/Utils";
import { KeysProperties, navigateOnRowAndKey } from "../../utils/data";
import { AppContext } from "../App/App";
import { ProfilePictureContainer } from "../PictureContainer/ProfilePictureContainer";
import { TableViewHead } from "./TableViewHead/TableViewHead";

interface TableViewProps<T extends IdDTO> {
  tableName: string;
  tableProperties: KeysProperties<T>;
  staticItems: T[];
  totalItems?: number;
  handleReloadHandler?: (requestData: APRequestData, additionalCallback?: () => void) => void;
  dense?: boolean;
  navigateOnClick?: { navigationBaseRoute: string };
  toolbarActions?: (dense: boolean, handleReload: () => void) => JSX.Element[];
  getRowActions?: (row: T) => JSX.Element[];
}

export const TableView = <T extends IdDTO>({
  tableName,
  tableProperties,
  staticItems = [],
  totalItems = staticItems.length,
  handleReloadHandler,
  dense = false,
  navigateOnClick,
  toolbarActions = () => [],
  getRowActions = () => [],
}: TableViewProps<T>) => {
  const navigate = useNavigate();
  const { user, pageSize, setPageSize } = useContext(AppContext);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASCENDING);
  const [sortKey, setSortKey] = useState<keyof T | "">(tableProperties.defaultSortKey);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [filterValue, setFilterValue] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(handleReloadHandler === undefined);

  useEffect(() => {
    setSortDirection(SortDirection.ASCENDING);
    setSortKey(tableProperties.defaultSortKey);
    setPageNumber(0);
    setFilterValue("");
    handleReload();
  }, [user]);

  useEffect(() => {
    handleReload();
  }, [sortDirection, sortKey, pageNumber, pageSize, filterValue]);

  const handleReload = () => {
    if (!user) return;

    const paginatedRequest = {
      pageIndex: pageNumber,
      pageSize: pageSize,
      columnNameForSorting: sortKey,
      sortDirection: sortDirection,
      requestFilters: {
        logicalOperator: 0,
        filters: [
          {
            path: tableProperties.filterKey,
            value: filterValue,
          },
        ],
      },
    };

    handleReloadHandler && handleReloadHandler({ requestBody: paginatedRequest }, () => setLoaded(true));
  };

  const handleSort = (property: keyof T) => {
    const isAscending = sortKey === property && sortDirection === SortDirection.ASCENDING;
    setSortDirection(isAscending ? SortDirection.DESCENDING : SortDirection.ASCENDING);
    setSortKey(property);
  };

  const getTableRows = useCallback(
    () =>
      staticItems.map((row: any) => {
        let rowCells = tableProperties.keys.map((key) => (
          <TableCell align="center">
            {key.isDate ? (
              formatDate(row[key.name])
            ) : key.isImage ? (
              <ProfilePictureContainer src={row[key.name]} />
            ) : (
              navigateOnRowAndKey(row, key).toString()
            )}
          </TableCell>
        ));

        const finalCells = getRowActions ? [...rowCells, getRowActions(row)] : rowCells;

        return (
          <TableRow
            key={row.id}
            hover
            sx={{ cursor: navigateOnClick ? "pointer" : undefined }}
            onClick={(_) => navigateOnClick && navigate(`/${navigateOnClick.navigationBaseRoute}/${row.id}`)}
          >
            {finalCells}
          </TableRow>
        );
      }),
    [staticItems]
  );

  return (
    loaded && (
      <Box
        sx={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flex: 1 }}
          >
            {tableName}
          </Typography>
          {toolbarActions(dense, handleReload)}
          {!dense && (
            <TextField
              type="search"
              variant="standard"
              sx={{ fontSize: "small", width: "20rem" }}
              label={
                <Box sx={{ display: "flex" }}>
                  <SearchIcon />
                  <Typography>{`Search by ${formatKeyToSpacedLowercase(
                    tableProperties.filterKey.toString()
                  )}`}</Typography>
                </Box>
              }
              onChange={(event) => {
                setFilterValue(event.currentTarget.value);
                setPageNumber(0);
              }}
            />
          )}
        </Toolbar>
        <TableContainer
          sx={{
            flex: 1,
            display: staticItems.length === 0 ? "flex" : undefined,
            alignItems: staticItems.length === 0 ? "center" : undefined,
            justifyContent: staticItems.length === 0 ? "center" : undefined,
          }}
        >
          {staticItems.length === 0 ? (
            <Typography variant="h6">No entries</Typography>
          ) : (
            <Table size={dense ? "small" : "medium"}>
              <TableViewHead
                sortDirection={sortDirection}
                sortKey={sortKey}
                handleSort={handleSort}
                keysOfT={tableProperties.keys}
                dense={dense}
                haveActions={getRowActions({} as T).length !== 0}
              />
              <TableBody>{getTableRows()}</TableBody>
            </Table>
          )}
        </TableContainer>
        {!dense && (
          <TablePagination
            component={"div"}
            rowsPerPageOptions={[5, 10]}
            count={totalItems}
            page={pageNumber}
            rowsPerPage={pageSize}
            onPageChange={(_, newPage: number) => setPageNumber(newPage)}
            onRowsPerPageChange={(event) => {
              setPageNumber(0);
              setPageSize(Number(event.target.value) as 5 | 10);
            }}
          />
        )}
      </Box>
    )
  );
};
