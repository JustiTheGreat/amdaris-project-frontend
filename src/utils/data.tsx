import {
  CompetitionDisplayDTO,
  CompetitorDisplayDTO,
  GameFormatGetDTO,
  IdDTO,
  MatchDisplayDTO,
  PlayerDisplayDTO,
  PointDisplayDTO,
  RankingItemDTO,
  TeamDisplayDTO,
} from "./Types";

export interface ModelKey<T extends IdDTO> {
  name: keyof T;
  sortable: boolean;
  reference?: ModelKey<any>;
}

export interface KeysProperties<T extends IdDTO> {
  keys: ModelKey<T>[];
  filterKey: keyof T;
  defaultSortKey: keyof T;
}

export const navigateOnKey = (key: ModelKey<any>): any => key.name;

export const navigateOnRowAndKey = (row: any, key: ModelKey<any>): any =>
  key.reference ? navigateOnRowAndKey(row[key.name], key.reference) : row[key.name] ?? "-";

export const CompetitionKeysProperties: KeysProperties<CompetitionDisplayDTO> = {
  keys: [
    { name: "id", sortable: true },
    { name: "name", sortable: true },
    { name: "status", sortable: true },
    { name: "gameType", sortable: false },
    { name: "competitorType", sortable: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const PlayerKeysProperties: KeysProperties<PlayerDisplayDTO> = {
  keys: [
    { name: "id", sortable: true },
    { name: "name", sortable: true },
    { name: "competitorType", sortable: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const TeamKeysProperties: KeysProperties<TeamDisplayDTO> = {
  keys: [
    { name: "id", sortable: true },
    { name: "name", sortable: true },
    { name: "competitorType", sortable: false },
    { name: "numberOfPlayers", sortable: false },
    { name: "numberOfActivePlayers", sortable: false },
  ],
  filterKey: "name",
  defaultSortKey: "name",
};

export const MatchKeysProperties: KeysProperties<MatchDisplayDTO> = {
  keys: [
    { name: "id", sortable: true },
    { name: "competitors", sortable: false },
    { name: "status", sortable: true },
    { name: "competition", sortable: false },
    { name: "competitorsPoints", sortable: false },
    { name: "winner", sortable: false },
    { name: "startTime", sortable: true },
  ],
  filterKey: "status",
  defaultSortKey: "startTime",
};

export const PointKeysProperties: KeysProperties<PointDisplayDTO> = {
  keys: [
    { name: "id", sortable: true },
    { name: "player", sortable: false },
    { name: "value", sortable: false },
  ],
  filterKey: "id",
  defaultSortKey: "id",
};

export const GameFormatKeysProperties: KeysProperties<GameFormatGetDTO> = {
  keys: [
    { name: "id", sortable: false },
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
    { name: "id", sortable: false },
    { name: "competitor", sortable: false, reference: { name: "name", sortable: false } },
    { name: "wins", sortable: false },
    { name: "points", sortable: false },
  ],
  filterKey: "id",
  defaultSortKey: "id",
};
