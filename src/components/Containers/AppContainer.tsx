import { Container } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";

interface AppContainerProps {
  center?: boolean;
}

export const AppContainer: FC<AppContainerProps> = ({ center }: AppContainerProps) => {
  return (
    <Container
      sx={{
        minHeight: "100vh",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: center ? "center" : "undefined",
        alignItems: center ? "center" : "stretch",
        padding: (theme) => theme.spacing(2, 2, 30, 2),
      }}
    >
      <Outlet />
    </Container>
  );
};
