import { SortDirection } from "@mui/material";
import { useNavigate } from "react-router-dom";

const domain: string = "https://localhost:7107/";
export const authenticationPath: string = "/";
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
const createPlayerPath = `${competitorPath}/${playerPath}`;
const createTeamPath = `${competitorPath}/${teamPath}`;
const createGameFormatPath = `${gameFormatPath}`;

const getCompetitionsPath = `${competitionPath}/GetPaginatedCompetitions`;
const getPlayersPath = `${competitorPath}/GetPaginatedPlayers`;
const getTeamsPath = `${competitorPath}/GetPaginatedTeams`;
const getGameFormatsPath = `${gameFormatPath}/GetPaginatedGameFormats`;
const getGameTypesPath = `${gameTypePath}/GetPaginatedGameTypes`;

const loginPath = "User/Login";
const registerPath = "User/Register";

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

export const useRequests = (setAlertMessage: (message: string) => void) => {
  const navigate = useNavigate();

  const request = (
    path: string,
    method: "POST" | "GET" | "PUT" | "DELETE",
    callback?: (responseText: string) => void,
    requestBody?: object
  ) => {
    fetch(`${domain}${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: requestBody ? JSON.stringify(requestBody) : undefined,
      mode: "cors",
    })
      .then(async (response) => {
        const data =
          response.headers.get("Content-Type") === "application/json; charset=utf-8"
            ? await response.json()
            : await response.text();
        if (response.status === 200 || response.status === 204) callback && callback(data);
        else if (response.status === 401 || response.status === 403) {
          setAlertMessage(data);
          navigate(authenticationPath);
        } else if (response.status === 409) {
          setAlertMessage(data);
        } else setAlertMessage(data);
      })
      .catch((error) => setAlertMessage(error.message));
  };

  const authenticationRequests = {
    loginRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(loginPath, "POST", callback, data.requestBody),
    registerRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(registerPath, "POST", callback, data.requestBody),
  };

  const paginatedRequests = {
    getCompetitionsRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(getCompetitionsPath, "POST", callback, data.requestBody),
    getPlayersRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(getPlayersPath, "POST", callback, data.requestBody),
    getTeamsRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(getTeamsPath, "POST", callback, data.requestBody),
    getGameFormatsRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(getGameFormatsPath, "POST", callback, data.requestBody),
    getGameTypesRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(getGameTypesPath, "POST", callback, data.requestBody),
  };

  const byIdRequests = {
    getCompetitionRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/${data.id}`, "GET", callback),
    getCompetitorRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitorPath}/${data.id}`, "GET", callback),
    getMatchRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${matchPath}/${data.id}`, "GET", callback),
  };

  const rankingRequests = {
    getCompetitionRankingRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/GetCompetitionRanking/${data.id}`, "GET", callback),
    getCompetitionWinnersRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/GetCompetitionWinners/${data.id}`, "GET", callback),
  };

  const competitionStatusRequests = {
    stopCompetitionRegistrationsRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/StopCompetitionRegistration/${data.id}`, "PUT", callback),
    startCompetitionRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/StartCompetition/${data.id}`, "PUT", callback),
    endCompetitionRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/EndCompetition/${data.id}`, "PUT", callback),
    cancelCompetitionRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/CancelCompetition/${data.id}`, "PUT", callback),
  };

  const competitionCompetitorsRequests = {
    getPlayersNotInCompetitionRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitorPath}/GetPlayersNotInCompetition/${data.id}`, "GET", callback),
    getTeamsThatCanBeAddedToCompetitionRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitorPath}/GetTeamsThatCanBeAddedToCompetition/${data.id}`, "GET", callback),
    registerCompetitorToCompetitionAdminRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/AddCompetitorToCompetition/${competitionPath}/${data.id}/${competitorPath}/${data.auxId}`,
        "PUT",
        callback
      ),
    registerCompetitorToCompetitionUserRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/AddCompetitorToCompetition/${data.id}`, "PUT", callback),
    removeCompetitorFromCompetitionAdminRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(
        `${competitionPath}/RemoveCompetitorFromCompetition/${competitionPath}/${data.id}/${competitorPath}/${data.auxId}`,
        "PUT",
        callback
      ),
    removeCompetitorFromCompetitionUserRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitionPath}/RemoveCompetitorFromCompetition/${data.id}`, "PUT", callback),
  };

  const teamPlayersRequests = {
    getPlayersNotInTeamRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitorPath}/GetPlayersNotInTeam/${data.id}`, "GET", callback),
    addPlayerToTeamAdminRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`TeamPlayer/AddPlayerToTeam/${teamPath}/${data.id}/${playerPath}/${data.auxId}`, "POST", callback),
    addPlayerToTeamUserRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`TeamPlayer/AddPlayerToTeam/${teamPath}/${data.id}`, "POST", callback),
    changeTeamPlayerStatusAdminRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`TeamPlayer/ChangeTeamPlayerStatus/${teamPath}/${data.id}/${playerPath}/${data.auxId}`, "PUT", callback),
    changeTeamPlayerStatusUserRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`TeamPlayer/ChangeTeamPlayerStatus/${teamPath}/${data.id}`, "PUT", callback),
    removePlayerFromTeamAdminRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`TeamPlayer/RemovePlayerFromTeam/${teamPath}/${data.id}/${playerPath}/${data.auxId}`, "DELETE", callback),
    removePlayerFromTeamUserRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`TeamPlayer/RemovePlayerFromTeam/${teamPath}/${data.id}`, "DELETE", callback),
  };

  const matchStatusRequests = {
    startMatchRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${startMatchPath}/${data.id}`, "PUT", callback),
    endMatchRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${endMatchPath}/${data.id}`, "PUT", callback, data.requestBody),
    cancelMatchRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${cancelMatchPath}/${data.id}`, "PUT", callback),
  };

  const pointRequests = {
    addValueToPointRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${pointPath}/Match/${data.id}/Player/${data.auxId}`, "PUT", callback, data.requestBody),
  };

  const winRatingsRequests = {
    getCompetitorWinRatingsRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(`${competitorPath}/getCompetitorWinRatings/${data.id}`, "GET", callback),
  };

  const createRequests = {
    createOneVsAllCompetitionRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(createOneVSAllCompetitionPath, "POST", callback, data.requestBody),
    createTournamentCompetitionRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(createTournamentCompetitionPath, "POST", callback, data.requestBody),
    createPlayerRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(createPlayerPath, "POST", callback, data.requestBody),
    createTeamRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(createTeamPath, "POST", callback, data.requestBody),
    createGameFormatRequest: (data: APRequestData, callback: (response: string) => void) =>
      request(createGameFormatPath, "POST", callback, data.requestBody),
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
    ...pointRequests,
    ...winRatingsRequests,
    ...createRequests,
  };
};
