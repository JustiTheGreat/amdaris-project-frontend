import { AddCircleOutline as AddCircleOutlineIcon } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FC, useContext, useState } from "react";
import { APRequestData, competitorPath } from "../../utils/PageConstants";
import { CompetitorDisplayDTO } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { PlayerKeysProperties } from "../../utils/data";
import { AppContext } from "../App/App";
import { RegisterUserDialog } from "../Dialogs/RegisterUserDialog";
import { TableView } from "../TableView/TableView";

export const PlayersOverview: FC = () => {
  const { requests, user } = useContext(AppContext);
  const [items, setItems] = useState<CompetitorDisplayDTO[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [createDialogIsOpen, setCreateDialogIsOpen] = useState<boolean>(false);

  const getItems = (requestData: APRequestData, additionalCallback: () => void) => {
    requests.getPlayersRequest(requestData, (data: any) => {
      setItems(data.items);
      setTotalItems(data.total);
      additionalCallback();
    });
  };

  const toolbarActions = (dense: boolean, handleReload: () => void) =>
    user?.role !== UserRole.Administrator || dense
      ? []
      : [
          <>
            <RegisterUserDialog
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
    <>
      <TableView<CompetitorDisplayDTO>
        tableName="Players"
        tableProperties={PlayerKeysProperties}
        staticItems={items}
        totalItems={totalItems}
        handleReloadHandler={getItems}
        navigateOnClick={{ navigationBaseRoute: competitorPath }}
        toolbarActions={toolbarActions}
      />
    </>
  );
};
