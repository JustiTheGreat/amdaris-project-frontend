import { Alert, Box, Snackbar } from "@mui/material";
import { FC, createContext, useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
import { getUserObjectFromToken } from "../../utils/Utils";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";
import { Authentication } from "../Authentication/Authentication";
import { AppContainer } from "../Containers/AppContainer";
import { NewPageContentContainer } from "../Containers/NewPageContentContainer";
import { CompetitionPage } from "../ModelPages/CompetitionPage";
import { CompetitorPage } from "../ModelPages/CompetitorPage";
import { MatchPage } from "../ModelPages/MatchPage";
import { ParallaxText } from "../MovingText/MovingText";
import { NavigationBar } from "../NavigationBar/NavigationBar";
import { NotFound } from "../NotFound/NotFound";
import { CompetitionsOverview } from "../Overviews/CompetitionsOverview";
import { GameFormatsOverview } from "../Overviews/GameFormatsOverview";
import { PlayersOverview } from "../Overviews/PlayersOverview";
import { TeamsOverview } from "../Overviews/TeamsOverview";
import { UnauthorizedContainer } from "../UnauthorizedContainer/UnauthorizedContainer";

interface User {
  role: string;
  playerId: string | undefined;
}

interface AppContextType {
  user: User | undefined;
  pageSize: number;
  setPageSize: (value: 5 | 10) => void;
  setAlertMessage: (value: string) => void;
  requests: any;
}

export const AppContext = createContext({} as AppContextType);

export type PageSize = 5 | 10;

export const App: FC = () => {
  const [pageSize, setPageSize] = useState<5 | 10>(5);
  const [alertMesssage, setAlertMessage] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User>();

  const requests = useRequests(setAlertMessage);

  const authenticated = useMemo<boolean>(
    () => location.pathname !== authenticationPath && localStorage.getItem("token") !== null,
    [location.pathname]
  );

  const unauthorizedAccess = useMemo(
    () => !authenticated && location.pathname !== authenticationPath,
    [location.pathname]
  );

  useEffect(
    () => (authenticated ? setUser(getUserObjectFromToken(localStorage.getItem("token"))) : undefined),
    [authenticated]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        pageSize,
        setPageSize,
        setAlertMessage,
        requests,
      }}
    >
      {/* <Box
        sx={{
          backgroundColor: "secondary.main",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
        }}
      ></Box> */}

      <Routes>
        <Route element={<AppContainer center />}>
          <Route
            path={authenticationPath}
            element={<Authentication />}
          />
          <Route
            path={"/*"}
            element={
              <VisibilityAnimation>
                <NewPageContentContainer width={"30rem"}>
                  <NotFound />
                </NewPageContentContainer>
              </VisibilityAnimation>
            }
          />
        </Route>

        <Route element={<AppContainer />}>
          <Route element={<UnauthorizedContainer unauthorizedAccess={unauthorizedAccess} />}>
            <Route element={<NavigationBar />}>
              <Route element={<NewPageContentContainer />}>
                <Route
                  path={competitionPath}
                  element={<CompetitionsOverview />}
                />
                <Route
                  path={playerPath}
                  element={<PlayersOverview />}
                />
                <Route
                  path={teamPath}
                  element={<TeamsOverview />}
                />
                <Route
                  path={gameFormatPath}
                  element={<GameFormatsOverview />}
                />
              </Route>

              <Route
                path={`${competitionPath}/:id`}
                element={<CompetitionPage />}
              />

              <Route
                path={`${competitorPath}/:id`}
                element={<CompetitorPage />}
              />

              <Route
                path={`${matchPath}/:id`}
                element={<MatchPage />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Snackbar
        open={Boolean(alertMesssage)}
        onClose={() => setAlertMessage(undefined)}
        onClick={() => setAlertMessage(undefined)}
      >
        <Alert
          variant="filled"
          severity="error"
        >
          {alertMesssage}
        </Alert>
      </Snackbar>
      <Box sx={{ position: "fixed", zIndex: "-1", bottom: 0 }}>
        <ParallaxText baseVelocity={-3}>Amdaris Project </ParallaxText>
        <ParallaxText baseVelocity={3}>Amdaris Project </ParallaxText>
      </Box>
    </AppContext.Provider>
  );
};
