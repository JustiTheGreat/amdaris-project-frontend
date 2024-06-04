import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { IdDTO, SortDirection } from "../../../utils/Types";
import { formatCamelCaseToReadable } from "../../../utils/Utils";
import { ModelKey, navigateOnKey } from "../../../utils/data";

interface TableViewHeadProps<T extends IdDTO> {
  keysOfT: ModelKey<T>[];
  sortKey: keyof T;
  sortDirection: SortDirection;
  // selectedItemsCount: number;
  // rowCount: number;
  // deletableEntries: boolean;
  handleSort: (property: keyof T) => void;
  // handleSelectAllItems: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dense: boolean;
  haveActions: boolean;
}

export const TableViewHead = <T extends IdDTO>({
  keysOfT,
  sortKey,
  sortDirection,
  // selectedItemsCount,
  // rowCount,
  // deletableEntries,
  handleSort,
  // handleSelectAllItems,
  dense,
  haveActions,
}: TableViewHeadProps<T>) => {
  return (
    <TableHead>
      <TableRow>
        {/* {deletableEntries && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selectedItemsCount > 0 && selectedItemsCount < rowCount}
              checked={rowCount > 0 && selectedItemsCount === rowCount}
              onChange={handleSelectAllItems}
            />
          </TableCell>
        )} */}
        {keysOfT
          .filter((keyOfT) => navigateOnKey(keyOfT) !== "id")
          .map((keyOfT) => (
            <TableCell
              key={navigateOnKey(keyOfT)}
              padding={"none"}
              align={"center"}
              sortDirection={!dense && keyOfT.sortable && sortKey === navigateOnKey(keyOfT) ? sortDirection : undefined}
            >
              {dense || !keyOfT.sortable ? (
                formatCamelCaseToReadable(navigateOnKey(keyOfT))
              ) : (
                <TableSortLabel
                  active={sortKey === navigateOnKey(keyOfT)}
                  direction={sortKey === navigateOnKey(keyOfT) ? sortDirection : undefined}
                  onClick={(_) => handleSort(navigateOnKey(keyOfT))}
                >
                  {formatCamelCaseToReadable(navigateOnKey(keyOfT))}
                  {sortKey === navigateOnKey(keyOfT) && (
                    <Box sx={visuallyHidden}>
                      {sortDirection === SortDirection.DESCENDING ? "sorted descending" : "sorted ascending"}
                    </Box>
                  )}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        {haveActions && <TableCell>Actions</TableCell>}
      </TableRow>
    </TableHead>
  );
};
