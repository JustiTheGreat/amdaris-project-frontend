import {
  AddCircleOutline as AddCircleOutlineIcon,
  EmojiEvents as EmojiEventsIcon,
  InfoOutlined as InfoOutlinedIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { competitionPath, competitorPath } from "../../utils/PageConstants";
import { MatchGetDTO, MatchStatus, PointDisplayDTO } from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { formatDate, getIndexOfEnumValueString } from "../../utils/Utils";
import { PointKeysProperties } from "../../utils/data";
import { AppContext } from "../App/App";
import { AddPointDialog } from "../Dialogs/AddPointDialog";
import { NewPageContentContainer, TabInfo } from "../Containers/NewPageContentContainer";
import { TableView } from "../TableView/TableView";
import { Timer } from "../Timer/Timer";

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

  const startRequest = () => requests.startMatchRequest({ id }, (data: any) => setMatch(data));

  const endRequest = (
    endStatus: MatchStatus.FINISHED | MatchStatus.SPECIAL_WIN_COMPETITOR_ONE | MatchStatus.SPECIAL_WIN_COMPETITOR_TWO
  ) =>
    requests.endMatchRequest(
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

  const getTabInfoList = useCallback((): TabInfo[] => {
    const tabInfoList: TabInfo[] = [];
    if (!match || !user) return tabInfoList;
    tabInfoList.push({
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
          <Typography variant="h4">
            <Button
              variant="outlined"
              size="large"
              sx={{ fontSize: "32px", fontWeight: "bold" }}
              onClick={() => navigate(`/${competitorPath}/${match.competitorOne.id}`)}
            >
              {match.competitorOne.name}
            </Button>
            {" - "}
            <Button
              variant="outlined"
              size="large"
              sx={{ fontSize: "32px", fontWeight: "bold" }}
              onClick={() => navigate(`/${competitorPath}/${match.competitorTwo.id}`)}
            >
              {match.competitorTwo.name}
            </Button>
          </Typography>
          <Typography variant="h6">-Match-</Typography>
          {(match.status === MatchStatus.FINISHED ||
            match.status === MatchStatus.CANCELED ||
            match.status === MatchStatus.SPECIAL_WIN_COMPETITOR_ONE ||
            match.status === MatchStatus.SPECIAL_WIN_COMPETITOR_TWO) && (
            <Typography variant="h6">
              Winner:{" "}
              {match.winner ? (
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ marginLeft: (theme) => theme.spacing(2), fontWeight: "bold" }}
                  onClick={() => navigate(`/${competitorPath}/${match.winner!.id}`)}
                >
                  {match.winner.name}
                </Button>
              ) : (
                "-"
              )}
            </Typography>
          )}
          {match.actualizedStartTime && match.status === MatchStatus.NOT_STARTED && (
            <Typography
              variant="h4"
              sx={{ display: "flex", alignItems: "center", gap: (theme) => theme.spacing(2) }}
            >
              <>Starts in</> <Timer untilDate={match.actualizedStartTime} />
            </Typography>
          )}
          {match.actualizedEndTime && match.status === MatchStatus.STARTED && (
            <Typography
              variant="h4"
              sx={{ display: "flex", alignItems: "center", gap: (theme) => theme.spacing(2) }}
            >
              <>Ends in</> <Timer untilDate={match.actualizedEndTime} />
            </Typography>
          )}
          <Box sx={{ height: (theme) => theme.spacing(5) }}></Box>
          <Box sx={{ display: "flex", gap: (theme) => theme.spacing(2) }}>
            <Box>
              <Typography>Initial start time: {formatDate(match.initialStartTime)}</Typography>
              <Typography>Actualized start time: {formatDate(match.actualizedStartTime)}</Typography>
              <Typography>Initial end time: {formatDate(match.initialEndTime)}</Typography>
              <Typography>Actualized end time: {formatDate(match.actualizedEndTime)}</Typography>
            </Box>
            <Box>
              <Typography>Location: {match.location}</Typography>
              <Typography>Status: {match.status}</Typography>
              <Typography>
                Competition:
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ marginLeft: (theme) => theme.spacing(2) }}
                  onClick={() => navigate(`/${competitionPath}/${match.competition.id}`)}
                >
                  {match.competition.name}
                </Button>
              </Typography>
              <Typography>Score: {`${match.competitorOnePoints ?? ""}-${match.competitorTwoPoints ?? ""}`}</Typography>
            </Box>
          </Box>
        </Box>
      ),
    });
    tabInfoList.push({
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
    });
    tabInfoList.push({
      tooltip: "Points",
      icon: <EmojiEventsIcon fontSize="large" />,
      content: (
        <TableView<PointDisplayDTO>
          tableName={"Points"}
          tableProperties={PointKeysProperties}
          staticItems={match.points.map((point) => ({ ...point, id: point.playerId }))}
          dense
          navigateOnClick={{ navigationBaseRoute: competitorPath }}
          getRowActions={isAdmin && match.status === MatchStatus.STARTED ? getPointActions : undefined}
        />
      ),
    });
    return tabInfoList;
  }, [match]);

  return !match || !user ? (
    <></>
  ) : (
    <>
      <AddPointDialog
        dialogIsOpen={addPointDialogIsOpen}
        closeDialog={() => setAddPointDialogIsOpen(false)}
        handleReload={getModel}
        matchId={id!}
        playerId={playerId!}
      />
      <NewPageContentContainer tabInfoList={getTabInfoList()} />
    </>
  );
};
