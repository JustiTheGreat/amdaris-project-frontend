import {
  EmojiEvents as EmojiEventsIcon,
  GroupAdd as GroupAddIcon,
  GroupRemove as GroupRemoveIcon,
  Groups as GroupsIcon,
  InfoOutlined as InfoOutlinedIcon,
  Receipt as ReceiptIcon,
  RecentActors as RecentActorsIcon,
  Scoreboard as ScoreboardIcon,
} from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { competitorPath, matchPath } from "../../utils/PageConstants";
import {
  CompetitionGetDTO,
  CompetitionStatus,
  CompetitionType,
  CompetitorDisplayDTO,
  CompetitorGetDTO,
  CompetitorType,
  MatchDisplayDTO,
  PlayerGetDTO,
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
import { NewPageContentContainer, TabInfo } from "../Containers/NewPageContentContainer";
import { RegisterPlayerToCompetitionDialog } from "../Dialogs/RegisterPlayerToCompetitionDialog";
import { RegisterTeamToCompetitionDialog } from "../Dialogs/RegisterTeamToCompetitionDialog";
import { TableView } from "../TableView/TableView";
import { Timer } from "../Timer/Timer";
import { ProfilePictureContainer } from "../PictureContainer/ProfilePictureContainer";

export const CompetitionPage: FC = () => {
  const navigate = useNavigate();
  const { requests, user } = useContext(AppContext);
  const [competition, setCompetition] = useState<CompetitionGetDTO>();
  const [ranking, setRanking] = useState<RankingItemDTO[]>([]);
  const [winners, setWinners] = useState<CompetitorGetDTO[]>([]);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [reloadDialogData, setReloadDialogData] = useState(false);
  const [firstTabSwitch, setFirstTabSwitch] = useState<boolean>(false);
  const { id } = useParams();

  const isAdmin = useMemo<boolean>(() => user?.role === UserRole.Administrator, [user]);
  const isUser = useMemo<boolean>(() => user?.role === UserRole.User, [user]);

  const isPlayerCompetition = useMemo<boolean>(
    () => competition?.competitorType === CompetitorType.PLAYER,
    [competition]
  );

  useEffect(() => {
    getModel();
    getRanking(id);
  }, []);

  useEffect(() => {
    setReloadDialogData(!reloadDialogData);
  }, [competition]);

  useEffect(() => {
    if (competition && competition.status === CompetitionStatus.FINISHED)
      requests.getCompetitionWinnersRequest({ id }, (data: any) => setWinners(data));
  }, [competition]);

  const getModel = () => {
    requests.getCompetitionRequest({ id }, (data: any) => setCompetition(data));
  };

  const stopRegistrationsRequest = () =>
    requests.stopCompetitionRegistrationsRequest({ id }, (data: any) => setCompetition(data));

  const startRequest = () => requests.startCompetitionRequest({ id }, (data: any) => setCompetition(data));

  // const endRequest = () =>
  //   requests.endCompetitionRequest({ id }, (data: any) => {
  //     setCompetition(data);
  //     setFirstTabSwitch(!firstTabSwitch);
  //   });

  const cancelRequest = () =>
    requests.cancelCompetitionRequest({ id }, (data: any) => {
      setCompetition(data);
      setFirstTabSwitch(!firstTabSwitch);
    });

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

  const getRanking = useCallback(
    (_: any, additionalCallback?: () => void) => {
      requests.getCompetitionRankingRequest({ id }, (data: any) => {
        setRanking(data);
        additionalCallback && additionalCallback();
      });
    },
    [id]
  );

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
                <Typography variant="h6">{`-${
                  competition.competitionType === CompetitionType.ONE_VS_ALL
                    ? "One VS All Competition"
                    : "Tournament Competition"
                }-`}</Typography>
                {(competition.status === CompetitionStatus.ORGANIZING ||
                  competition.status === CompetitionStatus.NOT_STARTED) && (
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: (theme) => theme.spacing(2) }}
                  >
                    <>Starts in</> <Timer untilDate={competition.actualizedStartTime} />
                  </Typography>
                )}
                {competition.status === CompetitionStatus.FINISHED && (
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: (theme) => theme.spacing(2),
                    }}
                  >
                    {winners.length <= 1 ? "Winner:" : "Winners:"}
                    {winners.length === 0
                      ? "-"
                      : winners.map((winner) => (
                          <Button
                            variant="outlined"
                            size="large"
                            sx={{
                              fontWeight: "bold",
                              display: "flex",
                              gap: (theme) => theme.spacing(2),
                            }}
                            onClick={() => navigate(`/${competitorPath}/${winner.id}`)}
                          >
                            {isPlayerCompetition && (
                              <ProfilePictureContainer src={(winner as PlayerGetDTO).profilePicture} />
                            )}
                            {winner.name}
                          </Button>
                        ))}
                    {isAdmin && (
                      <Tooltip
                        title={"Send dimplomas to winners"}
                        placement="right"
                      >
                        <IconButton
                          sx={{ "&:hover": { color: "focus.main" } }}
                          onClick={(_) => requests.SendDiplomasToCompetitionWinnersRequest({ id })}
                        >
                          <RecentActorsIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Typography>
                )}
                <Box sx={{ height: (theme) => theme.spacing(5) }}></Box>
                <Typography sx={{ fontWeight: "bold", color: (theme) => theme.palette.focus.main }}>
                  Status: {competition.status}
                </Typography>
                <Box sx={{ display: "flex", gap: (theme) => theme.spacing(2) }}>
                  <Box>
                    <Typography>Location: {competition.location}</Typography>
                    <Typography>Initial starting time: {formatDate(competition.initialStartTime)}</Typography>
                    <Typography>Actualized starting time: {formatDate(competition.actualizedStartTime)}</Typography>
                    <Typography>Game type: {competition.gameType.name}</Typography>
                  </Box>
                  <Box>
                    <Typography>Competitor type: {competition.competitorType}</Typography>
                    {competition.teamSize && <Typography>Team size: {competition.teamSize}</Typography>}
                    {competition.winAt && <Typography>Win at score: {competition.winAt}</Typography>}
                    {competition.durationInMinutes && (
                      <Typography>Match duration in minutes: {competition.durationInMinutes}</Typography>
                    )}
                    {competition.breakInMinutes && (
                      <Typography>Break time in minutes: {competition.breakInMinutes}</Typography>
                    )}
                  </Box>
                </Box>
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
          <RegisterPlayerToCompetitionDialog
            dialogIsOpen={dialogIsOpen}
            closeDialog={() => setDialogIsOpen(false)}
            handleReload={getModel}
            id={id}
            reloadDialogData={reloadDialogData}
          />
        ) : (
          <RegisterTeamToCompetitionDialog
            dialogIsOpen={dialogIsOpen}
            closeDialog={() => setDialogIsOpen(false)}
            handleReload={getModel}
            id={id}
            reloadDialogData={reloadDialogData}
          />
        ))}
      <NewPageContentContainer
        tabInfoList={tabInfoList}
        firstTabSwitch={firstTabSwitch}
      />
    </>
  );
};
