import {
  AppRegistration,
  EmojiEvents as EmojiEventsIcon,
  Groups as GroupsIcon,
  InfoOutlined as InfoOutlinedIcon,
  Percent as PercentIcon,
  Receipt as ReceiptIcon,
  Scoreboard as ScoreboardIcon,
} from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { competitionPath, competitorPath, matchPath } from "../../utils/PageConstants";
import {
  CompetitionDisplayDTO,
  CompetitorDisplayDTO,
  CompetitorGetDTO,
  MatchDisplayDTO,
  MatchStatus,
  PlayerGetDTO,
  TeamGetDTO,
  TeamPlayerDisplayDTO,
} from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import {
  CompetitionKeysProperties,
  MatchKeysProperties,
  TeamKeysProperties,
  TeamPlayerKeysProperties,
  WinRatingKeysProperties,
} from "../../utils/data";
import { AppContext } from "../App/App";
import { NewPageContentContainer, TabInfo } from "../Containers/NewPageContentContainer";
import { RegisterTeamMemberDialog } from "../Dialogs/RegisterTeamMember";
import { ProfilePictureContainer } from "../PictureContainer/ProfilePictureContainer";
import { TableView } from "../TableView/TableView";

export const CompetitorPage: FC = () => {
  const { user, requests } = useContext(AppContext);
  const [competitor, setCompetitor] = useState<CompetitorGetDTO>();
  const [winRatings, setWinRatings] = useState<any>();
  const { id } = useParams();
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [reloadDialogData, setReloadDialogData] = useState(false);

  const isAdmin = useMemo<boolean>(() => user?.role === UserRole.Administrator, [user]);
  const isUser = useMemo<boolean>(() => user?.role === UserRole.User, [user]);
  const isPlayer = useMemo<boolean>(() => (competitor as any as PlayerGetDTO)?.teams !== undefined, [competitor]);
  const isTeam = useMemo<boolean>(() => (competitor as any as TeamGetDTO)?.players !== undefined, [competitor]);
  const normalUserCanRegister = useMemo<boolean>(() => {
    if (!competitor || !user || !isTeam || !isUser) return false;
    const team = competitor as any as TeamGetDTO;
    const playerFromTeam: CompetitorDisplayDTO | undefined = team.players.find((player) => player.id === user.playerId);
    return !playerFromTeam && !team.matches.find((match) => match.status === MatchStatus.STARTED);
  }, [competitor]);

  useEffect(() => {
    getData();
  }, [location.pathname, competitor]);

  const getData = () => {
    getModel();
    getCompetitorWinRatings();
  };

  useEffect(() => setReloadDialogData(!reloadDialogData), [competitor]);

  const getModel = useCallback(() => requests.getCompetitorRequest({ id }, (data: any) => setCompetitor(data)), [id]);

  const getCompetitorWinRatings = () =>
    requests.getCompetitorWinRatingsRequest({ id }, (data: any) =>
      setWinRatings(Object.entries(data).map(([key, value]) => ({ gameType: key, winRating: value })))
    );

  const registerPlayerToTeamUser = useCallback(
    () => requests.addPlayerToTeamUserRequest({ id }, (_: any) => getData()),
    [id]
  );

  const changeTeamPlayerStatusUser = useCallback(
    () => requests.changeTeamPlayerStatusUserRequest({ id }, (_: any) => getData()),
    [id]
  );

  const removePlayerFromTeamUser = useCallback(
    () => requests.removePlayerFromTeamUserRequest({ id }, (_: any) => getData()),
    [id]
  );

  const changeTeamPlayerStatusAdmin = useCallback(
    (auxId: string) => requests.changeTeamPlayerStatusAdminRequest({ id, auxId }, (_: any) => getData()),
    [id]
  );

  const removePlayerFromTeamAdmin = useCallback(
    (auxId: string) => requests.removePlayerFromTeamAdminRequest({ id, auxId }, (_: any) => getData()),
    [id]
  );

  const playerToolbarActions = useCallback(
    () =>
      !isAdmin
        ? []
        : [
            <Tooltip title={"Register player"}>
              <IconButton onClick={() => setDialogIsOpen(true)}>
                <AppRegistration fontSize="medium" />
              </IconButton>
            </Tooltip>,
          ],
    [isAdmin]
  );

  const getPlayerActions = useCallback(
    (row: TeamPlayerDisplayDTO): JSX.Element[] =>
      !isAdmin
        ? []
        : [
            <Tooltip
              title={
                competitor?.teamPlayers.find((teamPlayer) => teamPlayer.playerId === row.playerId)?.isActive
                  ? "Make inactive"
                  : "Make active"
              }
            >
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  changeTeamPlayerStatusAdmin(row.playerId);
                }}
              >
                {competitor?.teamPlayers.find((teamPlayer) => teamPlayer.playerId === row.playerId)?.isActive ? (
                  <DoDisturbIcon color="warning" />
                ) : (
                  <CheckCircleOutlineIcon color="success" />
                )}
              </IconButton>
            </Tooltip>,
            <Tooltip title={"Remove player"}>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  removePlayerFromTeamAdmin(row.playerId);
                }}
              >
                <GridDeleteIcon color="error" />
              </IconButton>
            </Tooltip>,
          ],
    [isAdmin, competitor?.teamPlayers]
  );

  const getTabInfoList = useCallback((): TabInfo[] => {
    const tabInfoList: TabInfo[] = [];
    if (!competitor || !user) return tabInfoList;
    tabInfoList.push({
      tooltip: "Details",
      icon: <InfoOutlinedIcon fontSize="large" />,
      content: (
        <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Typography
            variant="h4"
            sx={{ display: "flex", gap: (theme) => theme.spacing(2) }}
          >
            {isPlayer && <ProfilePictureContainer src={(competitor as PlayerGetDTO).profilePicture} />}
            {competitor.name}
          </Typography>
          <Typography variant="h6">{`-${isPlayer ? "Player" : "Team"}-`}</Typography>
        </Box>
      ),
    });
    if (isUser && isTeam)
      tabInfoList.push({
        tooltip: "Actions",
        icon: <ReceiptIcon fontSize="large" />,
        content: isTeam && isUser && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: (theme) => theme.spacing(2),
            }}
          >
            <Typography variant="h4">
              {`You are 
              ${
                normalUserCanRegister
                  ? "not registered to this team"
                  : `registered and ${
                      competitor.teamPlayers.find((teamPlayer) => teamPlayer.playerId === user.playerId)?.isActive
                        ? "active"
                        : "inactive"
                    }`
              }!`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                gap: (theme) => theme.spacing(2),
              }}
            >
              <Button
                disabled={!normalUserCanRegister}
                onClick={registerPlayerToTeamUser}
              >
                Register to team
              </Button>
              <Button
                disabled={normalUserCanRegister}
                onClick={changeTeamPlayerStatusUser}
              >
                Change activity status
              </Button>
              <Button
                disabled={normalUserCanRegister}
                onClick={removePlayerFromTeamUser}
              >
                Leave team
              </Button>
            </Box>
          </Box>
        ),
      });
    tabInfoList.push({
      tooltip: "Win ratings",
      icon: <PercentIcon fontSize="large" />,
      content: (
        <TableView<any>
          tableName={"Win ratings"}
          tableProperties={WinRatingKeysProperties}
          dense
          staticItems={winRatings}
        />
      ),
    });
    tabInfoList.push({
      tooltip: "Competitions",
      icon: <EmojiEventsIcon fontSize="large" />,
      content: (
        <TableView<CompetitionDisplayDTO>
          tableName={"Competition"}
          tableProperties={CompetitionKeysProperties}
          dense
          staticItems={competitor?.competitions}
          navigateOnClick={{ navigationBaseRoute: competitionPath }}
        />
      ),
    });
    tabInfoList.push({
      tooltip: isPlayer ? "Teams" : "Players",
      icon: <GroupsIcon fontSize="large" />,
      content: isPlayer ? (
        <TableView<CompetitorDisplayDTO>
          tableName={"Teams"}
          tableProperties={TeamKeysProperties}
          dense
          staticItems={(competitor as any as PlayerGetDTO).teams}
          navigateOnClick={{ navigationBaseRoute: competitorPath }}
        />
      ) : (
        <TableView<TeamPlayerDisplayDTO>
          tableName={"Players"}
          tableProperties={TeamPlayerKeysProperties}
          dense
          staticItems={(competitor as any as TeamGetDTO).teamPlayers}
          navigateOnClick={{ navigationBaseRoute: competitorPath }}
          toolbarActions={playerToolbarActions}
          getRowActions={getPlayerActions}
        />
      ),
    });
    tabInfoList.push({
      tooltip: "Matches",
      icon: <ScoreboardIcon fontSize="large" />,
      content: (
        <TableView<MatchDisplayDTO>
          tableName={"Matches"}
          tableProperties={MatchKeysProperties}
          dense
          staticItems={competitor?.matches}
          navigateOnClick={{ navigationBaseRoute: matchPath }}
        />
      ),
    });
    return tabInfoList;
  }, [competitor]);

  return !competitor || !user ? (
    <></>
  ) : (
    <>
      {id && isTeam && isAdmin && (
        <RegisterTeamMemberDialog
          dialogIsOpen={dialogIsOpen}
          closeDialog={() => setDialogIsOpen(false)}
          handleReload={getData}
          id={id}
          reloadDialogData={reloadDialogData}
        />
      )}
      <NewPageContentContainer tabInfoList={getTabInfoList()} />
    </>
  );
};
