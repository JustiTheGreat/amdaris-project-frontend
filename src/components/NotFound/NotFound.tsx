import { Box, Typography } from "@mui/material";
import { FC } from "react";

export const NotFound: FC = () => {
  return (
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
      <Typography>PAGE NOT FOUND</Typography>
    </Box>
  );
};
