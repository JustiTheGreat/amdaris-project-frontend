import {
  AppRegistration,
  EmojiEvents as EmojiEventsIcon,
  Groups as GroupsIcon,
  InfoOutlined as InfoOutlinedIcon,
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
} from "../../utils/Types";
import { UserRole } from "../../utils/UserRoles";
import {
  CompetitionKeysProperties,
  MatchKeysProperties,
  PlayerKeysProperties,
  TeamKeysProperties,
} from "../../utils/data";
import { AppContext } from "../App/App";
import { RegisterMemberDialog } from "../Dialogs/RegisterMember";
import { NewPageContentContainer, TabInfo } from "../PageContentContainer/NewPageContentContainer";
import { TableView } from "../TableView/TableView";

export const CompetitorPage: FC = () => {
  const { user, requests } = useContext(AppContext);
  const [competitor, setCompetitor] = useState<CompetitorGetDTO>();
  const { id } = useParams();
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

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
    getModel();
  }, []);

  const getModel = useCallback(
    () => requests.getCompetitorRequest({ id }, (response: string) => setCompetitor(JSON.parse(response))),
    [id]
  );

  const registerPlayerToTeamUser = useCallback(
    () => requests.addPlayerToTeamUserRequest({ id }, (_: string) => getModel()),
    [id]
  );

  const changeTeamPlayerStatusUser = useCallback(
    () => requests.changeTeamPlayerStatusUserRequest({ id }, (_: string) => getModel()),
    [id]
  );

  const removePlayerFromTeamUser = useCallback(
    () => requests.removePlayerFromTeamUserRequest({ id }, (_: string) => getModel()),
    [id]
  );

  const changeTeamPlayerStatusAdmin = useCallback(
    (auxId: string) => requests.changeTeamPlayerStatusAdminRequest({ id, auxId }, (_: string) => getModel()),
    [id]
  );

  const removePlayerFromTeamAdmin = useCallback(
    (auxId: string) => requests.removePlayerFromTeamAdminRequest({ id, auxId }, (_: string) => getModel()),
    [id]
  );

  const playerToolbarActions = [
    <Tooltip title={"Register player"}>
      <IconButton onClick={() => setDialogIsOpen(true)}>
        <AppRegistration fontSize="medium" />
      </IconButton>
    </Tooltip>,
  ];

  const getPlayerActions = (row: CompetitorDisplayDTO): JSX.Element[] => [
    <Tooltip title={"Change status"}>
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          changeTeamPlayerStatusAdmin(row.id);
        }}
      >
        <DoDisturbIcon />
        <CheckCircleOutlineIcon />
      </IconButton>
    </Tooltip>,
    <Tooltip title={"Remove player"}>
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          removePlayerFromTeamAdmin(row.id);
        }}
      >
        <GridDeleteIcon />
      </IconButton>
    </Tooltip>,
  ];

  const getTabInfoList = useCallback((): TabInfo[] => {
    const tabInfoList: TabInfo[] = [];
    if (!competitor || !user) return tabInfoList;
    tabInfoList.push({
      tooltip: "Details",
      icon: <InfoOutlinedIcon fontSize="large" />,
      content: (
        <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h4">{competitor.name}</Typography>
        </Box>
      ),
    });
    if (isTeam)
      tabInfoList.push({
        tooltip: "Actions",
        icon: <ReceiptIcon fontSize="large" />,
        content: isTeam && isUser && (
          <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Button
              disabled={!normalUserCanRegister}
              onClick={registerPlayerToTeamUser}
            >
              Register
            </Button>
            <Button
              disabled={normalUserCanRegister}
              onClick={changeTeamPlayerStatusUser}
            >
              Change status
            </Button>
            <Button
              disabled={normalUserCanRegister}
              onClick={removePlayerFromTeamUser}
            >
              Leave
            </Button>
          </Box>
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
        <TableView<CompetitorDisplayDTO>
          tableName={"Players"}
          tableProperties={PlayerKeysProperties}
          deletableEntries
          dense
          staticItems={(competitor as any as TeamGetDTO).players}
          navigateOnClick={{ navigationBaseRoute: competitorPath }}
          getTableActions={isAdmin ? getPlayerActions : undefined}
          toolbarActions={isAdmin ? playerToolbarActions : undefined}
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
        <RegisterMemberDialog
          dialogIsOpen={dialogIsOpen}
          closeDialog={() => setDialogIsOpen(false)}
          id={id}
        />
      )}
      <NewPageContentContainer tabInfoList={getTabInfoList()} />
    </>
  );
};
