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
  profileSettingsPath,
  teamPath,
  useRequests,
} from "../../utils/PageConstants";
import { AppName, getUserObjectFromToken } from "../../utils/Utils";
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
import { ProfileSettings } from "../ProfileSettings/ProfileSettings";

interface User {
  role: string;
  playerId: string | undefined;
  profilePictureUri: string | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface AppContextType {
  user: User | undefined;
  pageSize: number;
  setPageSize: (value: 5 | 10) => void;
  setAlert: (value: Alert | undefined) => void;
  requests: any;
}

export interface Alert {
  message: string | undefined;
  severity: "success" | "error";
}

export const AppContext = createContext({} as AppContextType);

export type PageSize = 5 | 10;

export const App: FC = () => {
  const [pageSize, setPageSize] = useState<PageSize>(5);
  const [alert, setAlert] = useState<Alert | undefined>(undefined);
  const [user, setUser] = useState<User>();
  const requests = useRequests(setAlert);

  useEffect(() => {
    const handleStorage = () => setUser(getUserObjectFromToken(localStorage.getItem("token")));

    handleStorage();

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const unauthorizedAccess = useMemo(
    () => location.pathname !== authenticationPath && localStorage.getItem("token") === null,
    [location.pathname, user]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        pageSize,
        setPageSize,
        setAlert,
        requests,
      }}
    >
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

        <Route element={<AppContainer center={unauthorizedAccess} />}>
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
              <Route
                path={profileSettingsPath}
                element={<ProfileSettings />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Snackbar
        open={Boolean(alert)}
        onClose={() => setAlert(undefined)}
        onClick={() => setAlert(undefined)}
      >
        <Alert
          variant="filled"
          severity={alert?.severity}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
      <Box sx={{ position: "fixed", zIndex: "-1", bottom: 0 }}>
        <ParallaxText baseVelocity={-3}>{AppName} </ParallaxText>
        <ParallaxText baseVelocity={3}>{AppName} </ParallaxText>
      </Box>
    </AppContext.Provider>
  );
};
