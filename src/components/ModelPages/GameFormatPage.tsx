import { Typography } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GameFormatGetDTO } from "../../utils/Types";
import { AppContext } from "../App/App";
import { PageContentContainer } from "../PageContentContainer/PageContentContainer";

export const GameFormatPage: FC = () => {
  const { requests } = useContext(AppContext);
  const [gameFormat, setGameFormat] = useState<GameFormatGetDTO>();
  const { id } = useParams();

  useEffect(() => {
    getModel();
  }, []);

  const getModel = useCallback(
    () => requests.getGameFormatRequest({ id }, (response: string) => setGameFormat(JSON.parse(response))),
    [id]
  );

  return !gameFormat ? (
    <></>
  ) : (
    <>
      <PageContentContainer
        width="fit-content"
        height="fit-content"
      >
        <Typography>Name: {gameFormat.name}</Typography>
        <Typography>Game type: {gameFormat.gameType.name}</Typography>
        <Typography>Competitor type: {gameFormat.competitorType}</Typography>
        {gameFormat.teamSize && <Typography>Team size: {gameFormat.teamSize}</Typography>}
        {gameFormat.winAt && <Typography>Win a match at score: {gameFormat.winAt}</Typography>}
        {gameFormat.durationInMinutes && <Typography>Match duration (min): {gameFormat.durationInMinutes}</Typography>}
      </PageContentContainer>
    </>
  );
};
