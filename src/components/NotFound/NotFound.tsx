import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticationPath } from "../../utils/PageConstants";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";

export const NotFound: FC = () => {
  return (
    <VisibilityAnimation>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h1">404</Typography>
        <Typography fontSize={"large"}>PAGE NOT FOUND</Typography>
        <Link
          to={authenticationPath}
          style={{ fontSize: "small" }}
        >
          Authenticate here!
        </Link>
      </Box>
    </VisibilityAnimation>
  );
};
