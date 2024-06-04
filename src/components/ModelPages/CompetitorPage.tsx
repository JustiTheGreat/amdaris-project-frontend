import { AppRegistration } from "@mui/icons-material";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { competitionPath, competitorPath, matchPath, playerPath } from "../../utils/PageConstants";
import {
  CompetitionDisplayDTO,
  CompetitorGetDTO,
  MatchDisplayDTO,
  MatchStatus,
  PlayerDisplayDTO,
  PlayerGetDTO,
  TeamDisplayDTO,
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
import { PageContentContainer } from "../PageContentContainer/PageContentContainer";
import { TableView } from "../TableView/TableView";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const CompetitorPage: FC = () => {
  const { user, requests } = useContext(AppContext);
  const [competitor, setCompetitor] = useState<CompetitorGetDTO>();
  const { id } = useParams();
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  const isAdmin = useMemo<boolean>(() => user?.role === UserRole.Administrator, [user]);
  const isUser = useMemo<boolean>(() => user?.role === UserRole.User, [user]);
  const isPlayer = useMemo<boolean>(() => (competitor as any as PlayerGetDTO)?.teams !== undefined, [competitor]);
  const isTeam = useMemo<boolean>(() => (competitor as any as TeamGetDTO)?.players !== undefined, [competitor]);

  useEffect(() => {
    getModel();
  }, []);

  const getModel = useCallback(
    () => requests.getCompetitorRequest({ id }, (response: string) => setCompetitor(JSON.parse(response))),
    [id]
  );

  const registerPlayerToTeamUser = () =>
    requests.addPlayerToTeamUserRequest({ id }, (response: string) => setCompetitor(JSON.parse(response)));

  const changeTeamPlayerStatusUser = () =>
    requests.changeTeamPlayerStatusUserRequest({ id }, (response: string) => setCompetitor(JSON.parse(response)));

  const removePlayerFromTeamUser = () =>
    requests.removePlayerFromTeamUserRequest({ id }, (response: string) => setCompetitor(JSON.parse(response)));

  const normalUserCanRegister = useMemo<boolean>(() => {
    if (!competitor || !user || !isTeam || !isUser) return false;
    const team = competitor as any as TeamGetDTO;
    const playerFromTeam: PlayerDisplayDTO | undefined = team.players.find((player) => player.id === user.playerId);
    return !playerFromTeam && !team.matches.find((match) => match.status === MatchStatus.STARTED);
  }, [competitor]);

  const playerToolbarActions = [
    <Tooltip title={"Register player"}>
      <IconButton onClick={() => setDialogIsOpen(true)}>
        <AppRegistration fontSize="medium" />
      </IconButton>
    </Tooltip>,
  ];

  const getPlayerActions = (rowId: string): JSX.Element[] => [
    <Tooltip title={"Change status"}>
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          requests.changeTeamPlayerStatusAdminRequest({ id, auxId: rowId }, (response: string) =>
            setCompetitor(JSON.parse(response))
          );
        }}
      >
        <DoDisturbIcon />
        {/* <CheckCircleOutlineIcon /> */}
      </IconButton>
    </Tooltip>,
    <Tooltip title={"Remove player"}>
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          requests.removePlayerFromTeamAdminRequest({ id, auxId: rowId }, (response: string) =>
            setCompetitor(JSON.parse(response))
          );
        }}
      >
        <GridDeleteIcon />
      </IconButton>
    </Tooltip>,
  ];

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
      <Typography variant="h4">{competitor.name}</Typography>
      {isTeam && isUser && (
        <PageContentContainer
          width="fit-content"
          height="fit-content"
        >
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
        </PageContentContainer>
      )}
      <PageContentContainer
        width="fit-content"
        height="fit-content"
      >
        <TableView<MatchDisplayDTO>
          tableName={"Matches"}
          tableProperties={MatchKeysProperties}
          dense
          staticItems={competitor?.matches}
          navigateOnClick={{ navigationBaseRoute: matchPath }}
        />
      </PageContentContainer>
      <PageContentContainer
        width="fit-content"
        height="fit-content"
      >
        <TableView<CompetitionDisplayDTO>
          tableName={"Competition"}
          tableProperties={CompetitionKeysProperties}
          dense
          staticItems={competitor?.competitions}
          navigateOnClick={{ navigationBaseRoute: competitionPath }}
        />
      </PageContentContainer>
      {isPlayer && (
        <PageContentContainer
          width="fit-content"
          height="fit-content"
        >
          <TableView<TeamDisplayDTO>
            tableName={"Teams"}
            tableProperties={TeamKeysProperties}
            dense
            staticItems={(competitor as any as PlayerGetDTO).teams}
            navigateOnClick={{ navigationBaseRoute: competitorPath }}
          />
        </PageContentContainer>
      )}
      {isTeam && (
        <PageContentContainer
          width="fit-content"
          height="fit-content"
        >
          <TableView<PlayerDisplayDTO>
            tableName={"Players"}
            tableProperties={PlayerKeysProperties}
            deletableEntries
            dense
            staticItems={(competitor as any as TeamGetDTO).players}
            navigateOnClick={{ navigationBaseRoute: competitorPath }}
            getTableActions={getPlayerActions}
            toolbarActions={playerToolbarActions}
          />
        </PageContentContainer>
      )}
    </>
  );
};
