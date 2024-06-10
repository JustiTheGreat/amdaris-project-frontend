import {
  CompetitionDisplayDTO,
  CompetitorDisplayDTO,
  GameFormatGetDTO,
  IdDTO,
  MatchDisplayDTO,
  MatchStatus,
  PointDisplayDTO,
  RankingItemDTO,
} from "./Types";

export interface ModelKey<T extends IdDTO> {
  name: keyof T;
  sortable: boolean;
  reference?: ModelKey<any>;
}

export interface KeysProperties<T extends IdDTO> {
  keys: ModelKey<T>[];
  filterKey: keyof T | "";
  defaultSortKey: keyof T | "";
}

export const navigateOnKey = (key: ModelKey<any>): any => key.name;

export const navigateOnRowAndKey = (row: any, key: ModelKey<any>): any =>
  key.reference ? navigateOnRowAndKey(row[key.name], key.reference) : row[key.name] ?? "-";

export const CompetitionKeysProperties: KeysProperties<CompetitionDisplayDTO> = {
  keys: [
    { name: "name", sortable: true },
    { name: "competitionType", sortable: false },
    { name: "status", sortable: true },
    { name: "gameType", sortable: false },
    { name: "competitorType", sortable: false },
  ],
  filterKey: "name",
  defaultSortKey: "status",
};

export const PlayerKeysProperties: KeysProperties<CompetitorDisplayDTO> = {
  keys: [
    { name: "name", sortable: true },
    { name: "numberOfCompetitions", sortable: false },
    { name: "numberOfMatches", sortable: false },
    { name: "numberOfTeams", sortable: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const TeamKeysProperties: KeysProperties<CompetitorDisplayDTO> = {
  keys: [
    { name: "name", sortable: true },
    { name: "numberOfCompetitions", sortable: false },
    { name: "numberOfMatches", sortable: false },
    { name: "numberOfPlayers", sortable: false },
    { name: "numberOfActivePlayers", sortable: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const MatchKeysProperties: KeysProperties<SpecialMatch> = {
  keys: [
    { name: "status", sortable: true },
    { name: "startTime", sortable: true },
    { name: "competitors", sortable: false },
    { name: "score", sortable: false },
    { name: "competition", sortable: false },
    { name: "winner", sortable: false },
  ],
  filterKey: "startTime",
  defaultSortKey: "startTime",
};

export const PointKeysProperties: KeysProperties<PointDisplayDTO> = {
  keys: [
    { name: "player", sortable: false },
    { name: "value", sortable: false },
  ],
  filterKey: "",
  defaultSortKey: "",
};

export const GameFormatKeysProperties: KeysProperties<GameFormatGetDTO> = {
  keys: [
    { name: "name", sortable: true },
    { name: "gameType", sortable: false, reference: { name: "name", sortable: false } },
    { name: "competitorType", sortable: true },
    { name: "teamSize", sortable: true },
    { name: "winAt", sortable: true },
    { name: "durationInMinutes", sortable: true },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const RankingItemKeysProperties: KeysProperties<RankingItemDTO> = {
  keys: [
    { name: "competitor", sortable: false },
    { name: "wins", sortable: false },
    { name: "points", sortable: false },
  ],
  filterKey: "",
  defaultSortKey: "",
};

export interface SpecialTeamPlayer extends IdDTO {
  name: string;
  numberOfCompetitions: number;
  numberOfMatches: number;
  numberOfTeams?: number;
  isActive: string;
}

export const SpecialTeamPlayerKeysProperties: KeysProperties<SpecialTeamPlayer> = {
  keys: [
    { name: "name", sortable: false },
    { name: "numberOfCompetitions", sortable: false },
    { name: "numberOfMatches", sortable: false },
    { name: "numberOfTeams", sortable: false },
    { name: "isActive", sortable: false },
  ],
  filterKey: "",
  defaultSortKey: "",
};

export interface SpecialMatch extends IdDTO {
  status: MatchStatus;
  startTime?: string;
  competitors: string;
  score: string;
  competition: string;
  winner: string | null;
}
