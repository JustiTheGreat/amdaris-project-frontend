export enum SortDirection {
  ASCENDING = "asc",
  DESCENDING = "desc",
}

export enum CompetitionType {
  ONE_VS_ALL = "ONE_VS_ALL",
  TOURNAMENT = "TOURNAMENT",
}

export enum CompetitionStatus {
  ORGANIZING = "ORGANIZING",
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  CANCELED = "CANCELED",
}

export enum CompetitorType {
  PLAYER = "PLAYER",
  TEAM = "TEAM",
}

export enum MatchStatus {
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  CANCELED = "CANCELED",
  SPECIAL_WIN_COMPETITOR_ONE = "SPECIAL_WIN_COMPETITOR_ONE",
  SPECIAL_WIN_COMPETITOR_TWO = "SPECIAL_WIN_COMPETITOR_TWO",
}

export interface IdDTO {
  id: string;
}

export interface CompetitionDisplayDTO extends IdDTO {
  name: string;
  competitionType: CompetitionType;
  status: CompetitionStatus;
  gameType: string;
  competitorType: CompetitorType;
}

export interface CompetitorDisplayDTO extends IdDTO {
  name: string;
  competitorType: CompetitorType;
  numberOfCompetitions: number;
  numberOfMatches: number;
  numberOfTeams?: number;
  numberOfPlayers?: number;
  numberOfActivePlayers?: number;
  profilePicture: string | null;
}

export interface MatchDisplayDTO extends IdDTO {
  status: MatchStatus;
  startTime?: Date;
  competitors: string;
  score: string;
  competition: string;
  winner: string | null;
}

export interface PointDisplayDTO extends IdDTO {
  value: number;
  matchId: string;
  playerId: string;
  player: string;
  profilePicture: string | null;
}

export interface TeamPlayerDisplayDTO extends IdDTO {
  teamId: number;
  team: string;
  playerId: string;
  player: string;
  isActive: boolean;
  numberOfCompetitions: string;
  numberOfMatches: string;
  numberOfTeams: string;
  profilePicture: string | null;
}

export interface RankingItemDTO extends IdDTO {
  competitor: string;
  wins: number;
  points: number;
  profilePicture: string | null;
}

export interface GetDTO extends IdDTO {}

export interface CompetitionGetDTO extends GetDTO {
  name: string;
  location: string;
  initialStartTime: Date;
  actualizedStartTime: Date;
  status: CompetitionStatus;
  breakInMinutes: number | null;
  gameType: GameTypeGetDTO;
  competitorType: CompetitorType;
  teamSize: number | null;
  winAt: number | null;
  durationInMinutes: number | null;
  competitors: CompetitorDisplayDTO[];
  matches: MatchDisplayDTO[];
  competitionType: CompetitionType;
}

export interface OneVSAllCompetitionGetDTO extends CompetitionGetDTO {}

export interface TournamentCompetitionGetDTO extends CompetitionGetDTO {
  stageLevel: number;
}

export interface CompetitorGetDTO extends GetDTO {
  name: string;
  matches: MatchDisplayDTO[];
  wonMatches: string[];
  competitions: CompetitionDisplayDTO[];
  teamPlayers: TeamPlayerDisplayDTO[];
}

export interface PlayerGetDTO extends CompetitorGetDTO {
  points: string[];
  teams: CompetitorDisplayDTO[];
  profilePicture: string | null;
}

export interface TeamGetDTO extends CompetitorGetDTO {
  players: CompetitorDisplayDTO[];
}

export interface GameFormatGetDTO extends GetDTO {
  name: string;
  gameType: GameTypeGetDTO;
  competitorType: CompetitorType;
  teamSize: number | null;
  winAt: number | null;
  durationInMinutes: number | null;
}

export interface GameTypeGetDTO extends GetDTO {
  name: string;
}

export interface MatchGetDTO extends GetDTO {
  location: string;
  initialStartTime: Date | null;
  actualizedStartTime: Date | null;
  initialEndTime: Date | null;
  actualizedEndTime: Date | null;
  status: MatchStatus;
  competitorOne: CompetitorDisplayDTO;
  competitorTwo: CompetitorDisplayDTO;
  competition: CompetitionDisplayDTO;
  competitorOnePoints: number | null;
  competitorTwoPoints: number | null;
  winner: CompetitorDisplayDTO | null;
  stageLevel: number | null;
  stageIndex: number | null;
  points: PointDisplayDTO[];
}
