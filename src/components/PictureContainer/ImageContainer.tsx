import { Box, SxProps, Theme } from "@mui/material";
import { FC } from "react";

interface ImageContainerProps {
  src: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  sx?: SxProps<Theme>;
}

export const ImageContainer: FC<ImageContainerProps> = ({
  src,
  width,
  height,
  borderRadius = 0.5,
  sx,
}: ImageContainerProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        width: (theme) => (width ? theme.spacing(width) : "100%"),
        height: (theme) => (height ? theme.spacing(height) : "100%"),
        maxWidth: (theme) => (width ? theme.spacing(width) : "100%"),
        maxHeight: (theme) => (height ? theme.spacing(height) : "100%"),
        borderRadius: (theme) => theme.spacing(borderRadius),
        ...sx,
      }}
    >
      <img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};
