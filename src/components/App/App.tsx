import { Alert, Box, Container, Snackbar, useTheme } from "@mui/material/";
import { FC, createContext, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  authenticationPath,
  competitionPath,
  competitorPath,
  gameFormatPath,
  matchPath,
  playerPath,
  teamPath,
  useRequests,
} from "../../utils/PageConstants";
import { CompetitionDisplayDTO, GameFormatGetDTO, PlayerDisplayDTO, TeamDisplayDTO } from "../../utils/Types";
import {
  CompetitionKeysProperties,
  GameFormatKeysProperties,
  PlayerKeysProperties,
  TeamKeysProperties,
} from "../../utils/data";
import { Authentication } from "../Authentication/Authentication";
import { CreateCompetitionDialog } from "../Dialogs/CreateCompetitionDialog";
import { CreateGameFormatDialog } from "../Dialogs/CreateGameFormatDialog";
import { CreatePlayerDialog } from "../Dialogs/CreatePlayerDialog";
import { CreateTeamDialog } from "../Dialogs/CreateTeamDialog";
import { CompetitionPage } from "../ModelPages/CompetitionPage";
import { NavigationBar } from "../NavigationBar/NavigationBar";
import { NotFound } from "../NotFound/NotFound";
import { PageContentContainer } from "../PageContentContainer/PageContentContainer";
import { TableView } from "../TableView/TableView";
import { CompetitorPage } from "../ModelPages/CompetitorPage";
import { MatchPage } from "../ModelPages/MatchPage";
import { getUserObjectFromToken } from "../../utils/Utils";

interface User {
  role: string;
  playerId: string | undefined;
}

interface AppContextType {
  user: User | undefined;
  token: string | undefined;
  setToken: (value: string | undefined) => void;
  pageSize: number;
  setPageSize: (value: 5 | 10) => void;
  createDialogIsOpen: boolean;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  setAlertMessage: (value: string) => void;
  reload: boolean;
  doReload: () => void;
  requests: any;
}

export const AppContext = createContext({ token: undefined } as AppContextType);

export type PageSize = 5 | 10;

export const App: FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const [token, setToken] = useState<string | undefined>(undefined);
  const [pageSize, setPageSize] = useState<5 | 10>(5);
  const [alertMesssage, setAlertMessage] = useState<string | undefined>(undefined);
  const [createDialogIsOpen, setCreateDialogIsOpen] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  const requests = useRequests(token, setAlertMessage);

  const authenticated = useMemo<boolean>(
    () => location.pathname !== authenticationPath && token != undefined,
    [location.pathname]
  );

  useEffect(() => (authenticated ? setUser(getUserObjectFromToken(token!)) : undefined), [authenticated]);

  const doReload = () => setReload(!reload);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        setToken,
        pageSize,
        setPageSize,
        createDialogIsOpen,
        openCreateDialog: () => setCreateDialogIsOpen(true),
        closeCreateDialog: () => setCreateDialogIsOpen(false),
        setAlertMessage,
        reload,
        doReload,
        requests,
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.secondary.main,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container
          sx={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: authenticated ? "undefined" : "center",
            alignItems: authenticated ? "stretch" : "center",
            padding: "1rem",
          }}
        >
          {authenticated && <NavigationBar />}
          <Routes>
            <Route
              path={authenticationPath}
              element={
                <PageContentContainer
                  width={"30rem"}
                  height={"30rem"}
                >
                  <Authentication />
                </PageContentContainer>
              }
            />
            <Route element={<PageContentContainer />}>
              <Route path={competitionPath}>
                <Route
                  index
                  element={
                    <TableView<CompetitionDisplayDTO>
                      tableName="Competitions"
                      tableProperties={CompetitionKeysProperties}
                      getItemsRequest={{ request: requests.getCompetitionsRequest, paginated: true }}
                      navigateOnClick={{ navigationBaseRoute: competitionPath }}
                      createDialog={<CreateCompetitionDialog />}
                    />
                  }
                />
                <Route
                  path={":id"}
                  element={<CompetitionPage />}
                />
              </Route>
              <Route path={playerPath}>
                <Route
                  index
                  element={
                    <TableView<PlayerDisplayDTO>
                      tableName="Players"
                      tableProperties={PlayerKeysProperties}
                      getItemsRequest={{ request: requests.getPlayersRequest, paginated: true }}
                      navigateOnClick={{ navigationBaseRoute: competitorPath }}
                      createDialog={<CreatePlayerDialog />}
                    />
                  }
                />
              </Route>
              <Route path={teamPath}>
                <Route
                  index
                  element={
                    <TableView<TeamDisplayDTO>
                      tableName="Teams"
                      tableProperties={TeamKeysProperties}
                      getItemsRequest={{ request: requests.getTeamsRequest, paginated: true }}
                      navigateOnClick={{ navigationBaseRoute: competitorPath }}
                      createDialog={<CreateTeamDialog />}
                    />
                  }
                />
              </Route>
              <Route
                path={`${competitorPath}/:id`}
                element={<CompetitorPage />}
              />
              <Route
                path={`${matchPath}/:id`}
                element={<MatchPage />}
              />
              <Route path={gameFormatPath}>
                <Route
                  index
                  element={
                    <TableView<GameFormatGetDTO>
                      tableName="Game formats"
                      tableProperties={GameFormatKeysProperties}
                      getItemsRequest={{ request: requests.getGameFormatsRequest, paginated: true }}
                      createDialog={<CreateGameFormatDialog />}
                    />
                  }
                />
              </Route>
            </Route>
            <Route
              path={"/*"}
              element={
                <PageContentContainer
                  width="30rem"
                  height="30rem"
                >
                  <NotFound />
                </PageContentContainer>
              }
            />
          </Routes>
          <Snackbar
            open={Boolean(alertMesssage)}
            autoHideDuration={3000}
            onClose={() => setAlertMessage(undefined)}
          >
            <Alert
              variant="filled"
              severity="error"
            >
              {alertMesssage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </AppContext.Provider>
  );
};
