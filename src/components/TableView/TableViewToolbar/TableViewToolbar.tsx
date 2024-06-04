import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { FC, useContext } from "react";
import { AppContext } from "../../App/App";
import { UserRole } from "../../../utils/UserRoles";

interface TableViewToolbarProps {
  tableName: string;
  selectedItemsCount: number;
  searchMessage: string;
  setFilterValue: (value: string) => void;
  createDialog: JSX.Element | undefined;
  dense?: boolean;
  actions?: JSX.Element[];
}

export const TableViewToolbar: FC<TableViewToolbarProps> = ({
  tableName,
  selectedItemsCount,
  searchMessage,
  setFilterValue,
  createDialog,
  dense = false,
  actions,
}: TableViewToolbarProps) => {
  const { user, openCreateDialog } = useContext(AppContext);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selectedItemsCount > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      <Typography
        variant="h6"
        sx={{ flex: "1 1 100%" }}
      >
        {tableName}
      </Typography>
      {/* {selectedItemsCount === 0 ? (
        <Typography
          variant="h6"
          sx={{ flex: "1 1 100%" }}
        >
          {tableName}
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }}>{selectedItemsCount} selected</Typography>
      )} */}
      {actions}
      {user && user.role === UserRole.Administrator && !dense && selectedItemsCount === 0 && (
        <Tooltip title="Add new">
          <IconButton onClick={openCreateDialog}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      )}
      {!dense && selectedItemsCount === 0 && (
        <TextField
          type="search"
          variant="standard"
          sx={{ fontSize: "small", width: "20rem" }}
          label={
            <Box sx={{ display: "flex" }}>
              <SearchIcon />
              <Typography>{searchMessage}</Typography>
            </Box>
          }
          onChange={(event) => setFilterValue(event.currentTarget.value)}
        />
      )}
      {/* {selectedItemsCount !== 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <GridDeleteIcon />
          </IconButton>
        </Tooltip>
      )} */}
      {createDialog}
    </Toolbar>
  );
};
