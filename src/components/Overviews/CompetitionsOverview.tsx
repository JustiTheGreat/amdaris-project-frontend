import { AddCircleOutline as AddCircleOutlineIcon } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FC, useContext, useState } from "react";
import { APRequestData, competitionPath } from "../../utils/PageConstants";
import { CompetitionDisplayDTO } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { CompetitionKeysProperties } from "../../utils/data";
import { AppContext } from "../App/App";
import { CreateCompetitionDialog } from "../Dialogs/CreateCompetitionDialog";
import { TableView } from "../TableView/TableView";

export const CompetitionsOverview: FC = () => {
  const { requests, user } = useContext(AppContext);
  const [items, setItems] = useState<CompetitionDisplayDTO[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [createDialogIsOpen, setCreateDialogIsOpen] = useState<boolean>(false);

  const getItems = (requestData: APRequestData, additionalCallback: () => void) => {
    requests.getCompetitionsRequest(requestData, (data: any) => {
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
            <CreateCompetitionDialog
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
      <TableView<CompetitionDisplayDTO>
        tableName="Competitions"
        tableProperties={CompetitionKeysProperties}
        staticItems={items}
        totalItems={totalItems}
        handleReloadHandler={getItems}
        navigateOnClick={{ navigationBaseRoute: competitionPath }}
        toolbarActions={toolbarActions}
      />
    </>
  );
};
