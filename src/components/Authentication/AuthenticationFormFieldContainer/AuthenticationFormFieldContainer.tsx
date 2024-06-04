import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface AuthenticationFormFieldContainerProps {
  children: ReactNode;
  marginBottom?: string;
}

export const AuthenticationFormFieldContainer: FC<AuthenticationFormFieldContainerProps> = ({
  children,
  marginBottom,
}: AuthenticationFormFieldContainerProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: marginBottom,
      }}
    >
      {children}
    </Box>
  );
};
