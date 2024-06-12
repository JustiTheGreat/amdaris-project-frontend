import {
  CompetitionDisplayDTO,
  CompetitorDisplayDTO,
  GameFormatGetDTO,
  IdDTO,
  MatchDisplayDTO,
  PointDisplayDTO,
  RankingItemDTO,
} from "./Types";

export interface ModelKey<T extends IdDTO> {
  name: keyof T;
  sortable: boolean;
  isDate: boolean;
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
    { name: "name", sortable: true, isDate: false },
    { name: "competitionType", sortable: false, isDate: false },
    { name: "status", sortable: true, isDate: false },
    { name: "gameType", sortable: false, isDate: false },
    { name: "competitorType", sortable: false, isDate: false },
  ],
  filterKey: "name",
  defaultSortKey: "status",
};

export const PlayerKeysProperties: KeysProperties<CompetitorDisplayDTO> = {
  keys: [
    { name: "name", sortable: true, isDate: false },
    { name: "numberOfCompetitions", sortable: false, isDate: false },
    { name: "numberOfMatches", sortable: false, isDate: false },
    { name: "numberOfTeams", sortable: false, isDate: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const TeamKeysProperties: KeysProperties<CompetitorDisplayDTO> = {
  keys: [
    { name: "name", sortable: true, isDate: false },
    { name: "numberOfCompetitions", sortable: false, isDate: false },
    { name: "numberOfMatches", sortable: false, isDate: false },
    { name: "numberOfPlayers", sortable: false, isDate: false },
    { name: "numberOfActivePlayers", sortable: false, isDate: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const MatchKeysProperties: KeysProperties<MatchDisplayDTO> = {
  keys: [
    { name: "status", sortable: true, isDate: false },
    { name: "startTime", sortable: true, isDate: true },
    { name: "competitors", sortable: false, isDate: false },
    { name: "score", sortable: false, isDate: false },
    { name: "competition", sortable: false, isDate: false },
    { name: "winner", sortable: false, isDate: false },
  ],
  filterKey: "startTime",
  defaultSortKey: "startTime",
};

export const PointKeysProperties: KeysProperties<PointDisplayDTO> = {
  keys: [
    { name: "player", sortable: false, isDate: false },
    { name: "value", sortable: false, isDate: false },
  ],
  filterKey: "",
  defaultSortKey: "",
};

export const GameFormatKeysProperties: KeysProperties<GameFormatGetDTO> = {
  keys: [
    { name: "name", sortable: true, isDate: false },
    { name: "gameType", sortable: false, isDate: false, reference: { name: "name", sortable: false, isDate: false } },
    { name: "competitorType", sortable: true, isDate: false },
    { name: "teamSize", sortable: true, isDate: false },
    { name: "winAt", sortable: true, isDate: false },
    { name: "durationInMinutes", sortable: true, isDate: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const RankingItemKeysProperties: KeysProperties<RankingItemDTO> = {
  keys: [
    { name: "competitor", sortable: false, isDate: false },
    { name: "wins", sortable: false, isDate: false },
    { name: "points", sortable: false, isDate: false },
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
    { name: "name", sortable: false, isDate: false },
    { name: "numberOfCompetitions", sortable: false, isDate: false },
    { name: "numberOfMatches", sortable: false, isDate: false },
    { name: "numberOfTeams", sortable: false, isDate: false },
    { name: "isActive", sortable: false, isDate: false },
  ],
  filterKey: "",
  defaultSortKey: "",
};

export const WinRatingKeysProperties: KeysProperties<any> = {
  keys: [
    { name: "gameType", sortable: false, isDate: false },
    { name: "winRating", sortable: false, isDate: false },
  ],
  filterKey: "",
  defaultSortKey: "",
};
