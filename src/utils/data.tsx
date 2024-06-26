import {
  CompetitionDisplayDTO,
  CompetitorDisplayDTO,
  GameFormatGetDTO,
  IdDTO,
  MatchDisplayDTO,
  PointDisplayDTO,
  RankingItemDTO,
  TeamPlayerDisplayDTO,
} from "./Types";

export interface ModelKey<T extends IdDTO> {
  name: keyof T;
  sortable: boolean;
  isDate: boolean;
  isImage: boolean;
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
    { name: "name", sortable: true, isDate: false, isImage: false },
    { name: "competitionType", sortable: false, isDate: false, isImage: false },
    { name: "status", sortable: true, isDate: false, isImage: false },
    { name: "gameType", sortable: false, isDate: false, isImage: false },
    { name: "competitorType", sortable: false, isDate: false, isImage: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const PlayerKeysProperties: KeysProperties<CompetitorDisplayDTO> = {
  keys: [
    { name: "profilePicture", sortable: false, isDate: false, isImage: true },
    { name: "name", sortable: true, isDate: false, isImage: false },
    { name: "numberOfCompetitions", sortable: false, isDate: false, isImage: false },
    { name: "numberOfMatches", sortable: false, isDate: false, isImage: false },
    { name: "numberOfTeams", sortable: false, isDate: false, isImage: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const TeamKeysProperties: KeysProperties<CompetitorDisplayDTO> = {
  keys: [
    { name: "name", sortable: true, isDate: false, isImage: false },
    { name: "numberOfCompetitions", sortable: false, isDate: false, isImage: false },
    { name: "numberOfMatches", sortable: false, isDate: false, isImage: false },
    { name: "numberOfPlayers", sortable: false, isDate: false, isImage: false },
    { name: "numberOfActivePlayers", sortable: false, isDate: false, isImage: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const MatchKeysProperties: KeysProperties<MatchDisplayDTO> = {
  keys: [
    { name: "status", sortable: true, isDate: false, isImage: false },
    { name: "startTime", sortable: true, isDate: true, isImage: false },
    { name: "competitors", sortable: false, isDate: false, isImage: false },
    { name: "score", sortable: false, isDate: false, isImage: false },
    { name: "competition", sortable: false, isDate: false, isImage: false },
    { name: "winner", sortable: false, isDate: false, isImage: false },
  ],
  filterKey: "startTime",
  defaultSortKey: "startTime",
};

export const PointKeysProperties: KeysProperties<PointDisplayDTO> = {
  keys: [
    { name: "profilePicture", sortable: false, isDate: false, isImage: true },
    { name: "player", sortable: false, isDate: false, isImage: false },
    { name: "value", sortable: false, isDate: false, isImage: false },
  ],
  filterKey: "",
  defaultSortKey: "",
};

export const GameFormatKeysProperties: KeysProperties<GameFormatGetDTO> = {
  keys: [
    { name: "name", sortable: true, isDate: false, isImage: false },
    {
      name: "gameType",
      sortable: false,
      isDate: false,
      isImage: false,
      reference: { name: "name", sortable: false, isDate: false, isImage: false },
    },
    { name: "competitorType", sortable: true, isDate: false, isImage: false },
    { name: "teamSize", sortable: true, isDate: false, isImage: false },
    { name: "winAt", sortable: true, isDate: false, isImage: false },
    { name: "durationInMinutes", sortable: true, isDate: false, isImage: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const RankingItemKeysProperties: KeysProperties<RankingItemDTO> = {
  keys: [
    { name: "profilePicture", sortable: false, isDate: false, isImage: true },
    { name: "competitor", sortable: false, isDate: false, isImage: false },
    { name: "wins", sortable: false, isDate: false, isImage: false },
    { name: "points", sortable: false, isDate: false, isImage: false },
  ],
  filterKey: "",
  defaultSortKey: "",
};

export const TeamPlayerKeysProperties: KeysProperties<TeamPlayerDisplayDTO> = {
  keys: [
    { name: "profilePicture", sortable: false, isDate: false, isImage: true },
    { name: "player", sortable: false, isDate: false, isImage: false },
    { name: "numberOfCompetitions", sortable: false, isDate: false, isImage: false },
    { name: "numberOfMatches", sortable: false, isDate: false, isImage: false },
    { name: "numberOfTeams", sortable: false, isDate: false, isImage: false },
    { name: "isActive", sortable: false, isDate: false, isImage: false },
  ],
  filterKey: "",
  defaultSortKey: "",
};

export const WinRatingKeysProperties: KeysProperties<any> = {
  keys: [
    { name: "gameType", sortable: false, isDate: false, isImage: false },
    { name: "winRating", sortable: false, isDate: false, isImage: false },
  ],
  filterKey: "",
  defaultSortKey: "",
};
