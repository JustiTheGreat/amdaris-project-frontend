import { SortDirection } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Alert } from "../components/App/App";

const domain: string = "https://localhost:7107/";
export const authenticationPath: string = "/";
export const profileSettingsPath: string = "ProfileSettings";
export const competitionPath: string = "Competition";
const oneVSAllCompetitionPath: string = "OneVSAllCompetition";
const tournamentCompetitionPath: string = "TournamentCompetition";
export const competitorPath: string = "Competitor";
export const playerPath: string = "Player";
export const teamPath: string = "Team";
export const matchPath: string = "Match";
export const gameFormatPath: string = "GameFormat";
const gameTypePath: string = "GameType";
const pointPath: string = "Point";

const createOneVSAllCompetitionPath = `${competitionPath}/${oneVSAllCompetitionPath}`;
const createTournamentCompetitionPath = `${competitionPath}/${tournamentCompetitionPath}`;
const createTeamPath = `${competitorPath}/${teamPath}`;
const createGameFormatPath = `${gameFormatPath}`;

const getCompetitionsPath = `${competitionPath}/GetPaginatedCompetitions`;
const getPlayersPath = `${competitorPath}/GetPaginatedPlayers`;
const getTeamsPath = `${competitorPath}/GetPaginatedTeams`;
const getGameFormatsPath = `${gameFormatPath}/GetPaginatedGameFormats`;
const getGameTypesPath = `${gameTypePath}/GetPaginatedGameTypes`;

export const startMatchPath = `${matchPath}/StartMatch`;
export const endMatchPath = `${matchPath}/EndMatch`;
export const cancelMatchPath = `${matchPath}/CancelMatch`;

export interface PaginatedRequest {
  pageIndex: number;
  pageSize: number;
  columnNameForSorting: string;
  sortDirection: SortDirection;
  requestFilters: {
    logicalOperator: 0 | 1;
    filters: {
      path: string;
      value: string;
    }[];
  };
}

export interface APRequestData {
  id?: string;
  auxId?: string;
  requestBody?: object;
}

export type APRequest = (data: APRequestData, callback: (response: string) => void) => void;

export const useRequests = (setAlert: (message: Alert | undefined) => void) => {
  const navigate = useNavigate();

  const request = async (
    path: string,
    method: "POST" | "GET" | "PUT" | "DELETE",
    callback?: (responseText: string) => void,
    requestBody?: any,
    isFormData: boolean = false,
    successMessage?: string
  ) => {
    fetch(`${domain}${path}`, {
      method: method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: requestBody ? (isFormData ? requestBody : JSON.stringify(requestBody)) : undefined,
      mode: "cors",
    })
      .then(async (response) => {
        const data = response.headers.get("Content-Type")?.includes("application/json")
          ? await response.json()
          : await response.text();

        if (response.ok) {
          callback && callback(data);
          successMessage && setAlert({ message: successMessage, severity: "success" });
          return;
        }

        if (response.status === 401 || response.status === 403) {
          navigate(authenticationPath);
          localStorage.removeItem("token");
          setAlert({ message: "Session expired!", severity: "error" });
          return;
        }

        setAlert({ message: data, severity: "error" });
      })
      .catch((error) => setAlert({ message: error.message, severity: "error" }));
  };

  const authenticationRequests = {
    loginRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request("User/Login", "POST", callback, data.requestBody),
    registerRequest: async (data: APRequestData, callback: (response: string) => void) => {
      request("User/Register", "POST", callback, data.requestBody, true);
    },
    updateUserProfileRequest: async (data: APRequestData, callback: (response: string) => void) => {
      request("User/UpdateProfile", "POST", callback, data.requestBody, true);
    },
  };

  const paginatedRequests = {
    getCompetitionsRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(getCompetitionsPath, "POST", callback, data.requestBody),
    getPlayersRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(getPlayersPath, "POST", callback, data.requestBody),
    getTeamsRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(getTeamsPath, "POST", callback, data.requestBody),
    getGameFormatsRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(getGameFormatsPath, "POST", callback, data.requestBody),
    getGameTypesRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(getGameTypesPath, "POST", callback, data.requestBody),
    getPlayersNotInCompetitionRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitorPath}/GetPlayersNotInCompetition/${data.id}`, "POST", callback, data.requestBody),
    getTeamsThatCanBeAddedToCompetitionRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitorPath}/GetTeamsThatCanBeAddedToCompetition/${data.id}`, "POST", callback, data.requestBody),
    getPlayersNotInTeamRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitorPath}/GetPlayersNotInTeam/${data.id}`, "POST", callback, data.requestBody),
  };

  const byIdRequests = {
    getCompetitionRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/${data.id}`, "GET", callback),
    getCompetitorRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitorPath}/${data.id}`, "GET", callback),
    getMatchRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${matchPath}/${data.id}`, "GET", callback),
  };

  const rankingRequests = {
    getCompetitionRankingRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/GetCompetitionRanking/${data.id}`, "GET", callback),
    getCompetitionWinnersRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/GetCompetitionWinners/${data.id}`, "GET", callback),
    SendDiplomasToCompetitionWinnersRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/SendDiplomasToCompetitionWinners/${data.id}`,
        "GET",
        callback,
        undefined,
        undefined,
        "Diplomas were sent!"
      ),
  };

  const competitionStatusRequests = {
    stopCompetitionRegistrationsRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/StopCompetitionRegistration/${data.id}`,
        "PUT",
        callback,
        undefined,
        undefined,
        "Registrations stopped!"
      ),
    startCompetitionRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/StartCompetition/${data.id}`,
        "PUT",
        callback,
        undefined,
        undefined,
        "Competition started!"
      ),
    endCompetitionRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/EndCompetition/${data.id}`,
        "PUT",
        callback,
        undefined,
        undefined,
        "Competition ended!"
      ),
    cancelCompetitionRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/CancelCompetition/${data.id}`,
        "PUT",
        callback,
        undefined,
        undefined,
        "Competition was canceled!"
      ),
  };

  const competitionCompetitorsRequests = {
    registerCompetitorToCompetitionAdminRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/AddCompetitorToCompetition/${competitionPath}/${data.id}/${competitorPath}/${data.auxId}`,
        "PUT",
        callback
      ),
    registerCompetitorToCompetitionUserRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/AddCompetitorToCompetition/${data.id}`,
        "PUT",
        callback,
        undefined,
        undefined,
        "You registered successfully!"
      ),
    removeCompetitorFromCompetitionAdminRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/RemoveCompetitorFromCompetition/${competitionPath}/${data.id}/${competitorPath}/${data.auxId}`,
        "PUT",
        callback
      ),
    removeCompetitorFromCompetitionUserRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/RemoveCompetitorFromCompetition/${data.id}`,
        "PUT",
        callback,
        undefined,
        undefined,
        "You withdrew successfully!"
      ),
  };

  const teamPlayersRequests = {
    addPlayerToTeamAdminRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`TeamPlayer/AddPlayerToTeam/${teamPath}/${data.id}/${playerPath}/${data.auxId}`, "POST", callback),
    addPlayerToTeamUserRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `TeamPlayer/AddPlayerToTeam/${teamPath}/${data.id}`,
        "POST",
        callback,
        undefined,
        undefined,
        "You registered successfully!"
      ),
    changeTeamPlayerStatusAdminRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`TeamPlayer/ChangeTeamPlayerStatus/${teamPath}/${data.id}/${playerPath}/${data.auxId}`, "PUT", callback),
    changeTeamPlayerStatusUserRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `TeamPlayer/ChangeTeamPlayerStatus/${teamPath}/${data.id}`,
        "PUT",
        callback,
        undefined,
        undefined,
        "You changed your status!"
      ),
    removePlayerFromTeamAdminRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`TeamPlayer/RemovePlayerFromTeam/${teamPath}/${data.id}/${playerPath}/${data.auxId}`, "DELETE", callback),
    removePlayerFromTeamUserRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        `TeamPlayer/RemovePlayerFromTeam/${teamPath}/${data.id}`,
        "DELETE",
        callback,
        undefined,
        undefined,
        "You withdrew successfully!"
      ),
  };

  const matchStatusRequests = {
    startMatchRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${startMatchPath}/${data.id}`, "PUT", callback),
    endMatchRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${endMatchPath}/${data.id}`, "PUT", callback, data.requestBody),
    cancelMatchRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${cancelMatchPath}/${data.id}`, "PUT", callback),
  };

  const createRequests = {
    createOneVsAllCompetitionRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        createOneVSAllCompetitionPath,
        "POST",
        callback,
        data.requestBody,
        undefined,
        "Competition created successfully!"
      ),
    createTournamentCompetitionRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(
        createTournamentCompetitionPath,
        "POST",
        callback,
        data.requestBody,
        undefined,
        "Competition created successfully!"
      ),
    createTeamRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(createTeamPath, "POST", callback, data.requestBody, undefined, "Team created successfully!"),
    createGameFormatRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(createGameFormatPath, "POST", callback, data.requestBody, undefined, "Game format created successfully!"),
  };

  return {
    ...authenticationRequests,
    ...paginatedRequests,
    ...byIdRequests,
    ...rankingRequests,
    ...competitionStatusRequests,
    ...competitionCompetitorsRequests,
    ...teamPlayersRequests,
    ...matchStatusRequests,
    ...createRequests,
    getCompetitorWinRatingsRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitorPath}/getCompetitorWinRatings/${data.id}`, "GET", callback),
    addValueToPointRequest: async (data: APRequestData, callback: (response: string) => void) =>
      request(`${pointPath}/Match/${data.id}/Player/${data.auxId}`, "PUT", callback, data.requestBody),
  };
};
