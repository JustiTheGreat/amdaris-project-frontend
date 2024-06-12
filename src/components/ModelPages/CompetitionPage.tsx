import {
  EmojiEvents as EmojiEventsIcon,
  GroupAdd as GroupAddIcon,
  GroupRemove as GroupRemoveIcon,
  Groups as GroupsIcon,
  InfoOutlined as InfoOutlinedIcon,
  Receipt as ReceiptIcon,
  Scoreboard as ScoreboardIcon,
} from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { competitorPath, matchPath } from "../../utils/PageConstants";
import {
  CompetitionGetDTO,
  CompetitionStatus,
  CompetitorDisplayDTO,
  CompetitorGetDTO,
  CompetitorType,
  MatchDisplayDTO,
  RankingItemDTO,
} from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import { formatDate } from "../../utils/Utils";
import {
  MatchKeysProperties,
  PlayerKeysProperties,
  RankingItemKeysProperties,
  TeamKeysProperties,
} from "../../utils/data";
import { AppContext } from "../App/App";
import { RegisterPlayerDialog } from "../Dialogs/RegisterPlayer";
import { RegisterTeamDialog } from "../Dialogs/RegisterTeam";
import { NewPageContentContainer, TabInfo } from "../Containers/NewPageContentContainer";
import { TableView } from "../TableView/TableView";
import { Timer } from "../Timer/Timer";

export const CompetitionPage: FC = () => {
  const { requests, user } = useContext(AppContext);
  const [competition, setCompetition] = useState<CompetitionGetDTO>();
  const [ranking, setRanking] = useState<RankingItemDTO[]>([]);
  const [winners, setWinners] = useState<CompetitorGetDTO[]>([]);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const { id } = useParams();

  const isAdmin = useMemo<boolean>(() => user?.role === UserRole.Administrator, [user]);
  const isUser = useMemo<boolean>(() => user?.role === UserRole.User, [user]);

  const isPlayerCompetition = useMemo<boolean>(
    () => competition?.competitorType === CompetitorType.PLAYER,
    [competition]
  );

  useEffect(() => {
    getModel();
  }, []);

  useEffect(() => {
    if (competition && competition.status === CompetitionStatus.FINISHED)
      requests.getCompetitionWinnersRequest({ id }, (data: any) => setWinners(data));
  }, [competition]);

  const getModel = () => requests.getCompetitionRequest({ id }, (data: any) => setCompetition(data));

  const stopRegistrationsRequest = () =>
    requests.stopCompetitionRegistrationsRequest({ id }, (data: any) => setCompetition(data));

  const startRequest = () => requests.startCompetitionRequest({ id }, (data: any) => setCompetition(data));

  const endRequest = () => requests.endCompetitionRequest({ id }, (data: any) => setCompetition(data));

  const cancelRequest = () => requests.cancelCompetitionRequest({ id }, (data: any) => setCompetition(data));

  const registerCompetitorToCompetitionUser = () =>
    requests.registerCompetitorToCompetitionUserRequest({ id }, (data: any) => setCompetition(data));

  const removeCompetitorFromCompetitionUser = () =>
    requests.removeCompetitorFromCompetitionUserRequest({ id }, (data: any) => setCompetition(data));

  const normalUserCanRegister = useMemo<boolean>(() => {
    if (!competition || !user || !isUser) return false;
    const playerFromCompetition: CompetitorDisplayDTO | undefined = competition.competitors.find(
      (competitor) => competitor.id === user.playerId
    );
    return !playerFromCompetition && isPlayerCompetition;
  }, [competition]);

  const competitorToolbarActions = useCallback(
    () =>
      !isAdmin || competition?.status !== CompetitionStatus.ORGANIZING
        ? []
        : [
            <Tooltip title={`Register ${isPlayerCompetition ? "player" : "team"}`}>
              <IconButton onClick={() => setDialogIsOpen(true)}>
                <GroupAddIcon fontSize="medium" />
              </IconButton>
            </Tooltip>,
          ],
    [isAdmin, competition?.status, isPlayerCompetition]
  );

  const getCompetitorActions = useCallback(
    (row: CompetitorDisplayDTO): JSX.Element[] =>
      !isAdmin || competition?.status !== CompetitionStatus.ORGANIZING
        ? []
        : [
            <Tooltip title={`Remove ${isPlayerCompetition ? "player" : "team"}`}>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  requests.removeCompetitorFromCompetitionAdminRequest({ id, auxId: row.id }, (data: any) =>
                    setCompetition(data)
                  );
                }}
              >
                <GroupRemoveIcon />
              </IconButton>
            </Tooltip>,
          ],
    [isAdmin, competition?.status, isPlayerCompetition, id]
  );

  const getRanking = useCallback(() => {
    requests.getCompetitionRankingRequest({ id }, (data: any) => setRanking(data));
  }, [id]);

  const tabInfoList: TabInfo[] =
    !competition || !user
      ? []
      : [
          {
            tooltip: "Details",
            icon: <InfoOutlinedIcon fontSize="large" />,
            content: (
              <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h4">{competition.name}</Typography>
                {(competition.status === CompetitionStatus.ORGANIZING ||
                  competition.status === CompetitionStatus.NOT_STARTED) && (
                  <Typography
                    variant="h4"
                    sx={{ display: "flex", alignItems: "center", gap: (theme) => theme.spacing(2) }}
                  >
                    <>Starts in</> <Timer untilDate={competition.startTime} />
                  </Typography>
                )}
                {competition.status === CompetitionStatus.FINISHED && (
                  <Typography variant="h4">Winners:{winners.map((winner) => " " + winner.name)}</Typography>
                )}

                <Typography>Location: {competition.location}</Typography>
                <Typography>Starting time: {formatDate(competition.startTime)}</Typography>
                <Typography>Status: {competition.status}</Typography>
                {competition.breakInMinutes && (
                  <Typography>Break time in minutes: {competition.breakInMinutes}</Typography>
                )}
                <Typography>Game type: {competition.gameType.name}</Typography>
                <Typography>Competitor type: {competition.competitorType}</Typography>
                {competition.teamSize && <Typography>Team size: {competition.teamSize}</Typography>}
                {competition.winAt && <Typography>Win at score: {competition.winAt}</Typography>}
                {competition.durationInMinutes && (
                  <Typography>Match duration in minutes: {competition.durationInMinutes}</Typography>
                )}
              </Box>
            ),
          },
          {
            tooltip: "Actions",
            icon: <ReceiptIcon fontSize="large" />,
            content: ((isUser && competition.status === CompetitionStatus.ORGANIZING) ||
              (isAdmin &&
                competition.status !== CompetitionStatus.FINISHED &&
                competition.status !== CompetitionStatus.CANCELED)) && (
              <Box
                sx={{
                  display: "flex",
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
                  {isUser && competition.status === CompetitionStatus.ORGANIZING && (
                    <Button
                      disabled={!normalUserCanRegister}
                      onClick={registerCompetitorToCompetitionUser}
                    >
                      Register to competition
                    </Button>
                  )}
                  {isUser && competition.status === CompetitionStatus.ORGANIZING && (
                    <Button
                      disabled={normalUserCanRegister}
                      onClick={removeCompetitorFromCompetitionUser}
                    >
                      Leave competition
                    </Button>
                  )}
                  {(isAdmin && competition.status) === CompetitionStatus.ORGANIZING && (
                    <Button onClick={stopRegistrationsRequest}>Stop competition registrations</Button>
                  )}
                  {(isAdmin && competition.status) === CompetitionStatus.NOT_STARTED && (
                    <Button onClick={startRequest}>Start competition</Button>
                  )}
                  {(isAdmin && competition.status) === CompetitionStatus.STARTED && (
                    <Button onClick={endRequest}>End competition</Button>
                  )}
                  {isAdmin &&
                    (competition.status === CompetitionStatus.ORGANIZING ||
                      competition.status === CompetitionStatus.NOT_STARTED ||
                      competition.status === CompetitionStatus.STARTED) && (
                      <Button onClick={cancelRequest}>Cancel competition</Button>
                    )}
                </Box>
              </Box>
            ),
          },
          {
            tooltip: "Ranking",
            icon: <EmojiEventsIcon fontSize="large" />,
            content: (competition.status === CompetitionStatus.STARTED ||
              competition.status === CompetitionStatus.FINISHED) && (
              <TableView<RankingItemDTO>
                tableName={`${isPlayerCompetition ? "Players" : "Teams"} ranking`}
                tableProperties={RankingItemKeysProperties}
                staticItems={ranking}
                totalItems={ranking.length}
                handleReloadHandler={getRanking}
                dense
                navigateOnClick={{ navigationBaseRoute: competitorPath }}
              />
            ),
          },
          {
            tooltip: isPlayerCompetition ? "Players" : "Teams",
            icon: <GroupsIcon fontSize="large" />,
            content: isPlayerCompetition ? (
              <TableView<CompetitorDisplayDTO>
                tableName={"Players"}
                tableProperties={PlayerKeysProperties}
                staticItems={competition?.competitors}
                dense
                navigateOnClick={{ navigationBaseRoute: competitorPath }}
                toolbarActions={competitorToolbarActions}
                getRowActions={getCompetitorActions}
              />
            ) : (
              <TableView<CompetitorDisplayDTO>
                tableName={"Teams"}
                tableProperties={TeamKeysProperties}
                staticItems={competition?.competitors}
                dense
                navigateOnClick={{ navigationBaseRoute: competitorPath }}
                toolbarActions={competitorToolbarActions}
                getRowActions={getCompetitorActions}
              />
            ),
          },
          {
            tooltip: "Matches",
            icon: <ScoreboardIcon fontSize="large" />,
            content: (
              <TableView<MatchDisplayDTO>
                tableName="Matches"
                tableProperties={MatchKeysProperties}
                dense
                staticItems={competition?.matches}
                navigateOnClick={{ navigationBaseRoute: matchPath }}
              />
            ),
          },
        ];

  return !competition || !user ? (
    <></>
  ) : (
    <>
      {id &&
        isAdmin &&
        competition.status === CompetitionStatus.ORGANIZING &&
        (isPlayerCompetition ? (
          <RegisterPlayerDialog
            dialogIsOpen={dialogIsOpen}
            closeDialog={() => setDialogIsOpen(false)}
            handleReload={getModel}
            id={id}
          />
        ) : (
          <RegisterTeamDialog
            dialogIsOpen={dialogIsOpen}
            closeDialog={() => setDialogIsOpen(false)}
            handleReload={getModel}
            id={id}
          />
        ))}
      <NewPageContentContainer tabInfoList={tabInfoList} />
    </>
  );
};
