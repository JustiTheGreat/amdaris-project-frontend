import { Box, Typography, useTheme } from "@mui/material";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";
import { authenticationPath } from "../../utils/PageConstants";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";
import { NewPageContentContainer } from "../Containers/NewPageContentContainer";

interface UnauthorizedContainerProps {
  unauthorizedAccess: boolean;
}

export const UnauthorizedContainer: FC<UnauthorizedContainerProps> = ({
  unauthorizedAccess,
}: UnauthorizedContainerProps) => {
  const theme = useTheme();
  return (
    <VisibilityAnimation style={{ display: "flex", flexDirection: "column", gap: theme.spacing(4) }}>
      {unauthorizedAccess ? (
        <NewPageContentContainer width="30rem">
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h1">401</Typography>
            <Typography>UNAUTHORIZED ACCESS</Typography>
            <Link
              to={authenticationPath}
              style={{ fontSize: "small" }}
            >
              Authenticate here!
            </Link>
          </Box>
        </NewPageContentContainer>
      ) : (
        <Outlet />
      )}
    </VisibilityAnimation>
  );
};
