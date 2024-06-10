import { AddCircleOutline as AddCircleOutlineIcon } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FC, useContext, useState } from "react";
import { APRequestData, gameFormatPath } from "../../utils/PageConstants";
import { GameFormatGetDTO } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { GameFormatKeysProperties } from "../../utils/data";
import { AppContext } from "../App/App";
import { CreateGameFormatDialog } from "../Dialogs/CreateGameFormatDialog";
import { TableView } from "../TableView/TableView";

export const GameFormatsOverview: FC = () => {
  const { requests, user } = useContext(AppContext);
  const [items, setItems] = useState<GameFormatGetDTO[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [createDialogIsOpen, setCreateDialogIsOpen] = useState<boolean>(false);

  const getItems = (requestData: APRequestData) => {
    requests.getGameFormatsRequest(requestData, (data: any) => {
      setItems(data.items);
      setTotalItems(data.total);
    });
  };

  const toolbarActions = (dense: boolean, handleReload: () => void) =>
    user?.role !== UserRole.Administrator || dense
      ? []
      : [
          <>
            <CreateGameFormatDialog
              dialogIsOpen={createDialogIsOpen}
              closeDialog={() => setCreateDialogIsOpen(false)}
              handleReload={handleReload}
            />
            <Tooltip title="Add new">
              <IconButton onClick={() => setCreateDialogIsOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </>,
        ];

  return (
    <Box sx={{ flex: 1 }}>
      <TableView<GameFormatGetDTO>
        tableName="Game formats"
        tableProperties={GameFormatKeysProperties}
        staticItems={items}
        totalItems={totalItems}
        handleReloadHandler={getItems}
        navigateOnClick={{ navigationBaseRoute: gameFormatPath }}
        toolbarActions={toolbarActions}
      />
    </Box>
  );
};
