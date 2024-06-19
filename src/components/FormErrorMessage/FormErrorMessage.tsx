import { Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface FormErrorMessageProps {
  children?: ReactNode;
}

export const FormErrorMessage: FC<FormErrorMessageProps> = ({ children }: FormErrorMessageProps) => {
  return (
    <Typography sx={{ fontSize: "small", color: "error.main", height: "1rem" }}>
      {`${children ? "*" : ""}${children ?? ""}`}
    </Typography>
  );
};
