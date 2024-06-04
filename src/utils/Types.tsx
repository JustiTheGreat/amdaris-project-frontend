export enum AuthenticationAction {
  LOGIN = "Login",
  REGISTER = "Register",
}

export enum SortDirection {
  ASCENDING = "asc",
  DESCENDING = "desc",
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

export interface DisplayDTO extends IdDTO {}

export interface CompetitorDisplayDTO extends DisplayDTO {
  name: string;
  competitorType: string;
}

export interface PlayerDisplayDTO extends CompetitorDisplayDTO {}

export interface TeamDisplayDTO extends CompetitorDisplayDTO {
  numberOfPlayers: number;
  numberOfActivePlayers: number;
}

export interface CompetitionDisplayDTO extends DisplayDTO {
  name: string;
  status: CompetitionStatus;
  gameType: string;
  competitorType: CompetitorType;
}

export interface MatchDisplayDTO extends DisplayDTO {
  status: MatchStatus;
  competitors: string;
  competition: string;
  competitorsPoints: string;
  winner: string | null;
  startTime: Date;
}

export interface PointDisplayDTO extends DisplayDTO {
  value: number;
  player: string;
}

export interface GetDTO extends IdDTO {}

export interface CompetitionGetDTO extends GetDTO {
  name: string;
  location: string;
  startTime: Date;
  status: CompetitionStatus;
  breakInMinutes: number | null;
  gameType: GameTypeGetDTO;
  competitorType: CompetitorType;
  teamSize: number | null;
  winAt: number | null;
  durationInMinutes: number | null;
  competitors: CompetitorDisplayDTO[];
  matches: MatchDisplayDTO[];
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
}

export interface PlayerGetDTO extends CompetitionGetDTO {
  points: string[];
  teams: TeamDisplayDTO[];
}

export interface TeamGetDTO extends CompetitionGetDTO {
  players: PlayerDisplayDTO[];
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
  startTime: Date | null;
  endTime: Date | null;
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

export interface PointGetDTO extends GetDTO {
  value: number;
  match: string;
  player: PlayerDisplayDTO;
}

export interface TeamPlayerGetDTO extends GetDTO {
  teamId: string;
  playerId: string;
  isActive: boolean;
}

export interface RankingItemDTO extends IdDTO {
  competitor: CompetitorDisplayDTO;
  wins: number;
  points: number;
}
