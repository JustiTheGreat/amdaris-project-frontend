import {
  AddCircleOutline as AddCircleOutlineIcon,
  EmojiEvents as EmojiEventsIcon,
  InfoOutlined as InfoOutlinedIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { competitionPath, competitorPath } from "../../utils/PageConstants";
import { MatchGetDTO, MatchStatus, PointDisplayDTO } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { getIndexOfEnumValueString } from "../../utils/Utils";
import { PointKeysProperties } from "../../utils/data";
import { AppContext } from "../App/App";
import { AddPointDialog } from "../Dialogs/AddPointDialog";
import { NewPageContentContainer, TabInfo } from "../PageContentContainer/NewPageContentContainer";
import { TableView } from "../TableView/TableView";

export const MatchPage: FC = () => {
  const navigate = useNavigate();
  const { user, requests } = useContext(AppContext);
  const [match, setMatch] = useState<MatchGetDTO>();
  const { id } = useParams();
  const [addPointDialogIsOpen, setAddPointDialogIsOpen] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<string>();

  const isAdmin = useMemo<boolean>(() => user?.role === UserRole.Administrator, [user]);

  useEffect(() => {
    getModel();
  }, []);

  const getModel = () => requests.getMatchRequest({ id }, (data: any) => setMatch(data));

  const startRequest = () => requests.startMatch({ id }, (data: any) => setMatch(data));

  const endRequest = (
    endStatus: MatchStatus.FINISHED | MatchStatus.SPECIAL_WIN_COMPETITOR_ONE | MatchStatus.SPECIAL_WIN_COMPETITOR_TWO
  ) =>
    requests.endMatch(
      { id, requestBody: getIndexOfEnumValueString<MatchStatus>(MatchStatus, endStatus) },
      (data: any) => setMatch(data)
    );

  const cancelRequest = () => requests.cancelMatchRequest({ id }, (data: any) => setMatch(data));

  const getPointActions = (row: PointDisplayDTO): JSX.Element[] => [
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: (theme) => theme.spacing(1),
                }}
              >
                {(match.status === MatchStatus.FINISHED ||
                  match.status === MatchStatus.CANCELED ||
                  match.status === MatchStatus.SPECIAL_WIN_COMPETITOR_ONE ||
                  match.status === MatchStatus.SPECIAL_WIN_COMPETITOR_TWO) && (
                  <Typography variant="h4">Winner: {match.winner?.name ?? "-"}</Typography>
                )}
                <Typography>Location: {match.location}</Typography>
                <Typography>StartTime: {match.startTime?.toString() ?? "-"}</Typography>
                <Typography>EndTime: {match.endTime?.toString() ?? "-"}</Typography>
                <Typography>Status: {match.status}</Typography>
                <Typography>
                  Competitor one:{" "}
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/${competitorPath}/${match.competitorOne.id}`)}
                  >
                    {match.competitorOne.name}
                  </Button>
                </Typography>
                <Typography>
                  Competitor two:{" "}
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/${competitorPath}/${match.competitorTwo.id}`)}
                  >
                    {match.competitorTwo.name}
                  </Button>
                </Typography>
                <Typography>
                  Competition:{" "}
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/${competitionPath}/${match.competition.id}`)}
                  >
                    {match.competition.name}
                  </Button>
                </Typography>
                <Typography>Score: {`${match.competitorOnePoints}-${match.competitorTwoPoints}`}</Typography>
              </Box>
            ),
          },
          {
            tooltip: "Actions",
            icon: <ReceiptIcon fontSize="large" />,
            content: (match.status === MatchStatus.NOT_STARTED || match.status === MatchStatus.STARTED) && (
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: (theme) => theme.spacing(2),
                  }}
                >
                  {match.status === MatchStatus.NOT_STARTED && <Button onClick={startRequest}>Start match</Button>}
                  {match.status === MatchStatus.STARTED && (
                    <Button onClick={() => endRequest(MatchStatus.FINISHED)}>End match</Button>
                  )}
                  {match.status === MatchStatus.STARTED && (
                    <Button onClick={() => endRequest(MatchStatus.SPECIAL_WIN_COMPETITOR_ONE)}>
                      Give a Special Win to Competitor One
                    </Button>
                  )}
                  {match.status === MatchStatus.STARTED && (
                    <Button onClick={() => endRequest(MatchStatus.SPECIAL_WIN_COMPETITOR_TWO)}>
                      Give a Special Win to Competitor Two
                    </Button>
                  )}
                  {(match.status === MatchStatus.NOT_STARTED || match.status === MatchStatus.STARTED) && (
                    <Button onClick={cancelRequest}>Cancel</Button>
                  )}
                </Box>
              </Box>
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
                getTableActions={isAdmin && match.status === MatchStatus.STARTED ? getPointActions : undefined}
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
