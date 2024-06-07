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
import { FC, useContext, useEffect, useMemo, useState } from "react";
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
import {
  MatchKeysProperties,
  PlayerKeysProperties,
  RankingItemKeysProperties,
  TeamKeysProperties,
} from "../../utils/data";
import { AppContext } from "../App/App";
import { RegisterPlayerDialog } from "../Dialogs/RegisterPlayer";
import { RegisterTeamDialog } from "../Dialogs/RegisterTeam";
import { NewPageContentContainer, TabInfo } from "../PageContentContainer/NewPageContentContainer";
import { TableView } from "../TableView/TableView";

export const CompetitionPage: FC = () => {
  const { requests, user } = useContext(AppContext);
  const [competition, setCompetition] = useState<CompetitionGetDTO>();
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

  const competitorToolbarActions = [
    <Tooltip title={`Register ${isPlayerCompetition ? "player" : "team"}`}>
      <IconButton onClick={() => setDialogIsOpen(true)}>
        <GroupAddIcon fontSize="medium" />
      </IconButton>
    </Tooltip>,
  ];

  const getCompetitorActions = (row: CompetitorDisplayDTO): JSX.Element[] => [
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
  ];

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
                <Typography variant="h4">Winners:{winners.map((winner) => " " + winner.name)}</Typography>
                <Typography>Name: {competition.name}</Typography>
                <Typography>Location: {competition.location}</Typography>
                <Typography>StartTime: {competition.startTime.toString()}</Typography>
                <Typography>Status: {competition.status}</Typography>
                {competition.breakInMinutes && (
                  <Typography>Break time in minutes: {competition.breakInMinutes}</Typography>
                )}
                <Typography>GameType: {competition.gameType.name}</Typography>
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
                dense
                getItemsRequest={{ request: requests.getCompetitionRankingRequest, id }}
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
                deletableEntries={isAdmin}
                dense
                staticItems={competition?.competitors}
                navigateOnClick={{ navigationBaseRoute: competitorPath }}
                getTableActions={
                  isAdmin && competition.status === CompetitionStatus.ORGANIZING ? getCompetitorActions : undefined
                }
                toolbarActions={
                  isAdmin && competition.status === CompetitionStatus.ORGANIZING ? competitorToolbarActions : undefined
                }
              />
            ) : (
              <TableView<CompetitorDisplayDTO>
                tableName={"Teams"}
                tableProperties={TeamKeysProperties}
                deletableEntries={isAdmin}
                dense
                staticItems={competition?.competitors}
                navigateOnClick={{ navigationBaseRoute: competitorPath }}
                getTableActions={
                  isAdmin && competition.status === CompetitionStatus.ORGANIZING ? getCompetitorActions : undefined
                }
                toolbarActions={
                  isAdmin && competition.status === CompetitionStatus.ORGANIZING ? competitorToolbarActions : undefined
                }
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
            id={id}
          />
        ) : (
          <RegisterTeamDialog
            dialogIsOpen={dialogIsOpen}
            closeDialog={() => setDialogIsOpen(false)}
            id={id}
          />
        ))}
      <NewPageContentContainer tabInfoList={tabInfoList} />
    </>
  );
};
