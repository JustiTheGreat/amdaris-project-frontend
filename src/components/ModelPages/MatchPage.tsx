import { Button, Typography } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MatchGetDTO, MatchStatus, PointDisplayDTO } from "../../utils/Types";
import { getIndexOfEnumValueString } from "../../utils/Utils";
import { PointKeysProperties } from "../../utils/data";
import { AppContext } from "../App/App";
import { PageContentContainer } from "../PageContentContainer/PageContentContainer";
import { TableView } from "../TableView/TableView";

export const MatchPage: FC = () => {
  const { requests } = useContext(AppContext);
  const [match, setMatch] = useState<MatchGetDTO>();
  const { id } = useParams();

  useEffect(() => {
    getModel();
  }, []);

  const getModel = useCallback(
    () => requests.getMatchRequest({ id }, (response: string) => setMatch(JSON.parse(response))),
    [id]
  );

  const startRequest = () => requests.startMatch({ id }, (response: string) => setMatch(JSON.parse(response)));

  const endRequest = (
    endStatus: MatchStatus.FINISHED | MatchStatus.SPECIAL_WIN_COMPETITOR_ONE | MatchStatus.SPECIAL_WIN_COMPETITOR_TWO
  ) =>
    requests.endMatch(
      { id, requestBody: getIndexOfEnumValueString<MatchStatus>(MatchStatus, endStatus) },
      (response: string) => setMatch(JSON.parse(response))
    );

  const cancelRequest = () => requests.cancelMatchRequest({ id }, (response: string) => setMatch(JSON.parse(response)));

  return !match ? (
    <></>
  ) : (
    <>
      <PageContentContainer
        width="fit-content"
        height="fit-content"
      >
        <Typography>Name: {match.location}</Typography>
        <Typography>StartTime: {match.startTime?.toString() ?? "-"}</Typography>
        <Typography>EndTime: {match.endTime?.toString() ?? "-"}</Typography>
        <Typography>Status: {match.status}</Typography>
        <Typography>Competitor one: {match.competitorOne.name}</Typography>
        <Typography>Competitor two: {match.competitorTwo.name}</Typography>
        <Typography>Competition: {match.competition.name}</Typography>
        <Typography>Score: {`${match.competitorOnePoints}-${match.competitorTwoPoints}`}</Typography>
        <Typography>Winner: {match.winner?.name ?? "-"}</Typography>
      </PageContentContainer>
      <PageContentContainer
        width="fit-content"
        height="fit-content"
      >
        {match.status === MatchStatus.NOT_STARTED && <Button onClick={startRequest}>Start match</Button>}
        {match.status === MatchStatus.STARTED && (
          <Button onClick={() => endRequest(MatchStatus.FINISHED)}>End match</Button>
        )}
        {match.status === MatchStatus.STARTED && (
          <Button onClick={() => endRequest(MatchStatus.SPECIAL_WIN_COMPETITOR_ONE)}>Special Win Competitor One</Button>
        )}
        {match.status === MatchStatus.STARTED && (
          <Button onClick={() => endRequest(MatchStatus.SPECIAL_WIN_COMPETITOR_TWO)}>Special Win Competitor Two</Button>
        )}
        {(match.status === MatchStatus.NOT_STARTED || match.status === MatchStatus.STARTED) && (
          <Button onClick={cancelRequest}>Cancel</Button>
        )}
        {match.status === MatchStatus.STARTED && <Button>Add Point To Competitor</Button>}
      </PageContentContainer>
      <PageContentContainer>
        <TableView<PointDisplayDTO>
          tableName={"Points"}
          tableProperties={PointKeysProperties}
          dense
          staticItems={match.points}
        />
      </PageContentContainer>
    </>
  );
};
