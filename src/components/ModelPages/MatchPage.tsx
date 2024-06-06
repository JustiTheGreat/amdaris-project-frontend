import {
  EmojiEvents as EmojiEventsIcon,
  InfoOutlined as InfoOutlinedIcon,
  Receipt as ReceiptIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MatchGetDTO, MatchStatus, PointDisplayDTO } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { getIndexOfEnumValueString } from "../../utils/Utils";
import { PointKeysProperties } from "../../utils/data";
import { AppContext } from "../App/App";
import { NewPageContentContainer, TabInfo } from "../PageContentContainer/NewPageContentContainer";
import { PageContentContainer } from "../PageContentContainer/PageContentContainer";
import { TableView } from "../TableView/TableView";
import { AddPointDialog } from "../Dialogs/AddPointDialog";

export const MatchPage: FC = () => {
  const { user, requests } = useContext(AppContext);
  const [match, setMatch] = useState<MatchGetDTO>();
  const { id } = useParams();
  const [addPointDialogIsOpen, setAddPointDialogIsOpen] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<string>();

  const isAdmin = useMemo<boolean>(() => user?.role === UserRole.Administrator, [user]);

  useEffect(() => {
    getModel();
  }, []);

  const getModel = () => requests.getMatchRequest({ id }, (response: string) => setMatch(JSON.parse(response)));

  const startRequest = () => requests.startMatch({ id }, (response: string) => setMatch(JSON.parse(response)));

  const endRequest = (
    endStatus: MatchStatus.FINISHED | MatchStatus.SPECIAL_WIN_COMPETITOR_ONE | MatchStatus.SPECIAL_WIN_COMPETITOR_TWO
  ) =>
    requests.endMatch(
      { id, requestBody: getIndexOfEnumValueString<MatchStatus>(MatchStatus, endStatus) },
      (response: string) => setMatch(JSON.parse(response))
    );

  const cancelRequest = () => requests.cancelMatchRequest({ id }, (response: string) => setMatch(JSON.parse(response)));

  const getMatchActions = (row: PointDisplayDTO): JSX.Element[] => [
    <Tooltip title={"Add point"}>
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          setPlayerId(row.playerId);
          setAddPointDialogIsOpen(true);
        }}
      >
        <AddCircleOutlineIcon />
      </IconButton>
    </Tooltip>,
  ];

  const tabInfoList: TabInfo[] =
    !match || !user
      ? []
      : [
          {
            tooltip: "Details",
            icon: <InfoOutlinedIcon fontSize="large" />,
            content: (
              <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Typography>Name: {match.location}</Typography>
                <Typography>StartTime: {match.startTime?.toString() ?? "-"}</Typography>
                <Typography>EndTime: {match.endTime?.toString() ?? "-"}</Typography>
                <Typography>Status: {match.status}</Typography>
                <Typography>Competitor one: {match.competitorOne.name}</Typography>
                <Typography>Competitor two: {match.competitorTwo.name}</Typography>
                <Typography>Competition: {match.competition.name}</Typography>
                <Typography>Score: {`${match.competitorOnePoints}-${match.competitorTwoPoints}`}</Typography>
                <Typography>Winner: {match.winner?.name ?? "-"}</Typography>
              </Box>
            ),
          },
          {
            tooltip: "Actions",
            icon: <ReceiptIcon fontSize="large" />,
            content: (match.status === MatchStatus.NOT_STARTED || match.status === MatchStatus.STARTED) && (
              <PageContentContainer
                width="fit-content"
                height="fit-content"
              >
                {match.status === MatchStatus.NOT_STARTED && <Button onClick={startRequest}>Start match</Button>}
                {match.status === MatchStatus.STARTED && (
                  <Button onClick={() => endRequest(MatchStatus.FINISHED)}>End match</Button>
                )}
                {match.status === MatchStatus.STARTED && (
                  <Button onClick={() => endRequest(MatchStatus.SPECIAL_WIN_COMPETITOR_ONE)}>
                    Special Win Competitor One
                  </Button>
                )}
                {match.status === MatchStatus.STARTED && (
                  <Button onClick={() => endRequest(MatchStatus.SPECIAL_WIN_COMPETITOR_TWO)}>
                    Special Win Competitor Two
                  </Button>
                )}
                {(match.status === MatchStatus.NOT_STARTED || match.status === MatchStatus.STARTED) && (
                  <Button onClick={cancelRequest}>Cancel</Button>
                )}
                {match.status === MatchStatus.STARTED && <Button>Add Point To Competitor</Button>}
              </PageContentContainer>
            ),
          },
          {
            tooltip: "Points",
            icon: <EmojiEventsIcon fontSize="large" />,
            content: (
              <TableView<PointDisplayDTO>
                tableName={"Points"}
                tableProperties={PointKeysProperties}
                dense
                staticItems={match.points}
                getTableActions={isAdmin ? getMatchActions : undefined}
              />
            ),
          },
        ];

  return !match || !user ? (
    <></>
  ) : (
    <>
      <AddPointDialog
        dialogIsOpen={addPointDialogIsOpen}
        closeDialog={() => setAddPointDialogIsOpen(false)}
        successCallback={getModel}
        matchId={id!}
        playerId={playerId!}
      />
      <NewPageContentContainer tabInfoList={tabInfoList} />
    </>
  );
};
