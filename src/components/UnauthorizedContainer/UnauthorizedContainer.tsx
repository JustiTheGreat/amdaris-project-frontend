import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";
import { NewPageContentContainer } from "../Containers/NewPageContentContainer";
import { authenticationPath } from "../../utils/PageConstants";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";

interface UnauthorizedContainerProps {
  unauthorizedAccess: boolean;
}

export const UnauthorizedContainer: FC<UnauthorizedContainerProps> = ({
  unauthorizedAccess,
}: UnauthorizedContainerProps) => {
  return (
    <VisibilityAnimation>
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
