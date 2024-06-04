import { Box, useTheme } from "@mui/material";
import { FC, ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface PageContentContainerProps {
  children?: ReactNode;
  width?: string;
  height?: string;
}

export const PageContentContainer: FC<PageContentContainerProps> = ({
  children,
  width,
  height,
}: PageContentContainerProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: width,
        maxWidth: width,
        height: height,
        backgroundColor: theme.palette.primary.light,
        padding: "1rem",
        border: `0.3rem solid ${theme.palette.primary.main}`,
        borderRadius: "2rem",
        display: "flex",
        flexDirection: "column",
        rowGap: "0.7rem",
      }}
    >
      {children ?? <Outlet />}
    </Box>
  );
};
