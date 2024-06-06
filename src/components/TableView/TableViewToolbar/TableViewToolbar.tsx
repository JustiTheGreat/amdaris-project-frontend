import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { FC, useContext } from "react";
import { UserRole } from "../../../utils/UserRoles";
import { AppContext } from "../../App/App";

interface TableViewToolbarProps {
  tableName: string;
  searchMessage: string;
  setFilterValue: (value: string) => void;
  createDialog: JSX.Element | undefined;
  dense?: boolean;
  actions?: JSX.Element[];
}

export const TableViewToolbar: FC<TableViewToolbarProps> = ({
  tableName,
  searchMessage,
  setFilterValue,
  createDialog,
  dense = false,
  actions,
}: TableViewToolbarProps) => {
  const { user, openCreateDialog } = useContext(AppContext);

  return (
    <Toolbar>
      <Typography
        variant="h5"
        sx={{ flex: 1 }}
      >
        {tableName}
      </Typography>
      {actions}
      {user?.role === UserRole.Administrator && !dense && (
        <Tooltip title="Add new">
          <IconButton onClick={openCreateDialog}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      )}
      {!dense && (
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
      {createDialog}
    </Toolbar>
  );
};
