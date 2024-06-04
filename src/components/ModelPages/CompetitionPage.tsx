import { AppRegistration } from "@mui/icons-material";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";
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
  PlayerDisplayDTO,
  RankingItemDTO,
  TeamDisplayDTO,
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
import { PageContentContainer } from "../PageContentContainer/PageContentContainer";
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
    getWinners();
  }, []);

  useEffect(() => {
    getWinners();
  }, [competition]);

  const getModel = useCallback(
    () => requests.getCompetitionRequest({ id }, (response: string) => setCompetition(JSON.parse(response))),
    [id]
  );

  const getWinners = useCallback(
    () =>
      competition?.status === CompetitionStatus.FINISHED &&
      requests.getCompetitionWinnersRequest({ id }, (response: string) => setWinners(JSON.parse(response))),
    [id]
  );

  const stopRegistrationsRequest = () =>
    requests.stopCompetitionRegistrationsRequest({ id }, (response: string) => setCompetition(JSON.parse(response)));

  const startRequest = () =>
    requests.startCompetitionRequest({ id }, (response: string) => setCompetition(JSON.parse(response)));

  const endRequest = () =>
    requests.endCompetitionRequest({ id }, (response: string) => setCompetition(JSON.parse(response)));

  const cancelRequest = () =>
    requests.cancelCompetitionRequest({ id }, (response: string) => setCompetition(JSON.parse(response)));

  const registerCompetitorToCompetitionUser = () =>
    requests.registerCompetitorToCompetitionUserRequest({ id }, (response: string) =>
      setCompetition(JSON.parse(response))
    );

  const removeCompetitorFromCompetitionUser = () =>
    requests.removeCompetitorFromCompetitionUserRequest({ id }, (response: string) =>
      setCompetition(JSON.parse(response))
    );

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
        <AppRegistration fontSize="medium" />
      </IconButton>
    </Tooltip>,
  ];

  const getCompetitorActions = (rowId: string): JSX.Element[] => [
    <Tooltip title={`Remove ${isPlayerCompetition ? "player" : "team"}`}>
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          requests.removeCompetitorFromCompetitionAdminRequest({ id, auxId: rowId }, (response: string) =>
            setCompetition(JSON.parse(response))
          );
        }}
      >
        <GridDeleteIcon />
      </IconButton>
    </Tooltip>,
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
      <Typography variant="h4">{competition.name}</Typography>
      <Typography variant="h4">Winners:{winners.map((winner) => " " + winner.name)}</Typography>
      <PageContentContainer
        width="fit-content"
        height="fit-content"
      >
        <Typography>Name: {competition.name}</Typography>
        <Typography>Location: {competition.location}</Typography>
        <Typography>StartTime: {competition.startTime.toString()}</Typography>
        <Typography>Status: {competition.status}</Typography>
        {competition.breakInMinutes && <Typography>Break time in minutes: {competition.breakInMinutes}</Typography>}
        <Typography>GameType: {competition.gameType.name}</Typography>
        <Typography>Competitor type: {competition.competitorType}</Typography>
        {competition.teamSize && <Typography>Team size: {competition.teamSize}</Typography>}
        {competition.winAt && <Typography>Win at score: {competition.winAt}</Typography>}
        {competition.durationInMinutes && (
          <Typography>Match duration in minutes: {competition.durationInMinutes}</Typography>
        )}
      </PageContentContainer>
      {((isUser && competition.status === CompetitionStatus.ORGANIZING) ||
        (isAdmin &&
          competition.status !== CompetitionStatus.FINISHED &&
          competition.status !== CompetitionStatus.CANCELED)) && (
        <PageContentContainer width="fit-content">
          {(isUser && competition.status) === CompetitionStatus.ORGANIZING && (
            <Button
              disabled={!normalUserCanRegister}
              onClick={registerCompetitorToCompetitionUser}
            >
              Register
            </Button>
          )}
          {isUser && competition.status === CompetitionStatus.ORGANIZING && (
            <Button
              disabled={normalUserCanRegister}
              onClick={removeCompetitorFromCompetitionUser}
            >
              {"Abandon"}
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
        </PageContentContainer>
      )}
      {(competition.status === CompetitionStatus.STARTED || competition.status === CompetitionStatus.FINISHED) && (
        <PageContentContainer width="fit-content">
          <TableView<RankingItemDTO>
            tableName={`${isPlayerCompetition ? "Players" : "Teams"} ranking`}
            tableProperties={RankingItemKeysProperties}
            dense
            getItemsRequest={{ request: requests.getCompetitionRankingRequest, id }}
            navigateOnClick={{ navigationBaseRoute: competitorPath }}
          />
        </PageContentContainer>
      )}
      <PageContentContainer width="fit-content">
        {isPlayerCompetition ? (
          <TableView<PlayerDisplayDTO>
            tableName={"Players"}
            tableProperties={PlayerKeysProperties}
            deletableEntries={isAdmin}
            dense
            staticItems={competition?.competitors}
            navigateOnClick={{ navigationBaseRoute: competitorPath }}
            getTableActions={getCompetitorActions}
            toolbarActions={competitorToolbarActions}
          />
        ) : (
          <TableView<TeamDisplayDTO>
            tableName={"Teams"}
            tableProperties={TeamKeysProperties}
            deletableEntries={isAdmin}
            dense
            staticItems={competition?.competitors}
            navigateOnClick={{ navigationBaseRoute: competitorPath }}
            getTableActions={getCompetitorActions}
            toolbarActions={competitorToolbarActions}
          />
        )}
      </PageContentContainer>
      <PageContentContainer width="fit-content">
        <TableView<MatchDisplayDTO>
          tableName="Matches"
          tableProperties={MatchKeysProperties}
          dense
          staticItems={competition?.matches}
          navigateOnClick={{ navigationBaseRoute: matchPath }}
        />
      </PageContentContainer>
    </>
  );
};
