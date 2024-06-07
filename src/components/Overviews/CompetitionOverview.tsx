import { TableView } from "@mui/icons-material";
import { FC, useContext, useState } from "react";
import { APRequestData, competitionPath } from "../../utils/PageConstants";
import { AppContext } from "../App/App";
import { Box } from "@mui/material";
import { CompetitionDisplayDTO } from "../../utils/Types";
import { CompetitionKeysProperties } from "../../utils/data";
import { CreateCompetitionDialog } from "../Dialogs/CreateCompetitionDialog";

export const CompetitionOverview: FC = () => {
  const { requests } = useContext(AppContext);
  const [items, setItems] = useState<CompetitionDisplayDTO[]>([]);
  const [totalItems, setTotalItems] = useState<number>();

  const successCallback = (requestData: APRequestData) => {
    requests.getCompetitionsRequest(requestData, (data: any) => {
      setItems(data.items);
      setTotalItems(data.total);
    });
  };

  return (
    <Box>
      <TableView<CompetitionDisplayDTO>
        tableName="Competitions"
        tableProperties={CompetitionKeysProperties}
        getItemsRequest={{ request: requests.getCompetitionsRequest, paginated: true }}
        navigateOnClick={{ navigationBaseRoute: competitionPath }}
        createDialog={<CreateCompetitionDialog />}
      />
    </Box>
  );
};
