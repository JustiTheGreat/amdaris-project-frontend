import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { IdDTO, SortDirection } from "../../../utils/Types";
import { formatCamelCaseToReadable } from "../../../utils/Utils";
import { ModelKey, navigateOnKey } from "../../../utils/data";

interface TableViewHeadProps<T extends IdDTO> {
  keysOfT: ModelKey<T>[];
  sortKey: keyof T | "";
  sortDirection: SortDirection;
  handleSort: (property: keyof T) => void;
  dense: boolean;
  haveActions: boolean;
}

export const TableViewHead = <T extends IdDTO>({
  keysOfT,
  sortKey,
  sortDirection,
  handleSort,
  dense,
  haveActions,
}: TableViewHeadProps<T>) => {
  return (
    <TableHead>
      <TableRow
        sx={{
          position: "sticky",
          top: 0,
        }}
      >
        {keysOfT.map((keyOfT) => (
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
