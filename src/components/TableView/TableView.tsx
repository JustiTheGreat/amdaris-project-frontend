import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material/";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APRequest } from "../../utils/PageConstants";
import { IdDTO, SortDirection } from "../../utils/Types";
import { formatKeyToSpacedLowercase } from "../../utils/Utils";
import { KeysProperties, navigateOnRowAndKey } from "../../utils/data";
import { AppContext } from "../App/App";
import { TableViewHead } from "./TableViewHead/TableViewHead";
import { TableViewToolbar } from "./TableViewToolbar/TableViewToolbar";

interface TableViewProps<T extends IdDTO> {
  tableName: string;
  tableProperties: KeysProperties<T>;
  deletableEntries?: boolean;
  dense?: boolean;
  createDialog?: JSX.Element;
  getItemsRequest?: { request: APRequest; paginated?: boolean; id?: string };
  staticItems?: T[];
  navigateOnClick?: {
    navigationBaseRoute: string;
  };
  getTableActions?: (row: T) => JSX.Element[];
  toolbarActions?: JSX.Element[];
}

export const TableView = <T extends IdDTO>({
  tableName,
  tableProperties,
  dense = false,
  createDialog,
  getItemsRequest,
  staticItems,
  navigateOnClick,
  getTableActions,
  toolbarActions,
}: TableViewProps<T>) => {
  const navigate = useNavigate();
  const { user, pageSize, setPageSize, reload } = useContext(AppContext);
  const [items, setItems] = useState<T[]>(staticItems ?? []);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASCENDING);
  const [sortKey, setSortKey] = useState<keyof T>(tableProperties.defaultSortKey);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filterValue, setFilterValue] = useState<string>("");
  const shouldRequestData = useMemo(() => staticItems, [items]);

  useEffect(() => getItems(), [user]);

  useEffect(() => {
    setSortDirection(SortDirection.ASCENDING);
    setSortKey(tableProperties.defaultSortKey);
    setPageNumber(0);
    setFilterValue("");
    shouldRequestData ?? getItems();
  }, [reload]);

  useEffect(() => {
    shouldRequestData ?? getItems();
  }, [sortDirection, sortKey, pageNumber, pageSize, filterValue]);

  const getItems = () => {
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

    getItemsRequest?.request(
      {
        requestBody: getItemsRequest.paginated ? paginatedRequest : undefined,
        id: getItemsRequest.id,
      },
      (response) => {
        if (getItemsRequest.paginated) {
          const { items, total } = JSON.parse(response);
          setItems(items);
          setTotalItems(total);
        } else setItems(JSON.parse(response));
      }
    );
  };

  const handleSort = (property: keyof T) => {
    const isAscending = sortKey === property && sortDirection === SortDirection.ASCENDING;
    setSortDirection(isAscending ? SortDirection.DESCENDING : SortDirection.ASCENDING);
    setSortKey(property);
  };

  const getTableRows = useCallback(
    () =>
      items.map((row: any) => {
        let rowCells = tableProperties.keys.map((key) => (
          <TableCell align="center">{navigateOnRowAndKey(row, key)}</TableCell>
        ));

        const finalCells = getTableActions ? [...rowCells, getTableActions(row)] : rowCells;

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
    [items]
  );

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <TableViewToolbar
        tableName={tableName}
        searchMessage={`Search by ${formatKeyToSpacedLowercase(tableProperties.filterKey.toString())}`}
        setFilterValue={setFilterValue}
        createDialog={createDialog}
        dense={dense}
        actions={toolbarActions}
      />
      <TableContainer
        sx={{
          flex: 1,
          minHeight: (dense ? 2.5 : 3.7) * pageSize + "rem",
          display: items.length === 0 ? "flex" : undefined,
          alignItems: items.length === 0 ? "center" : undefined,
          justifyContent: items.length === 0 ? "center" : undefined,
        }}
      >
        {items.length === 0 ? (
          <Typography variant="h6">No entries</Typography>
        ) : (
          <Table size={dense ? "small" : "medium"}>
            <TableViewHead
              sortDirection={sortDirection}
              sortKey={sortKey}
              handleSort={handleSort}
              keysOfT={tableProperties.keys}
              dense={dense}
              haveActions={getTableActions !== undefined}
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
  );
};
