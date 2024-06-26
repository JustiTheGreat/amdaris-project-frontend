import { useTheme } from "@mui/material";
import { Variants, motion } from "framer-motion";
import { FC, ReactNode } from "react";

interface HoverAnimationProps {
  key?: string;
  children: ReactNode;
}

export const HoverAnimation: FC<HoverAnimationProps> = ({ key, children }: HoverAnimationProps) => {
  const theme = useTheme();
  return (
    <motion.div
      key={key}
      className="box"
      variants={{
        hover: {
          scale: 1.2,
          color: theme.palette.secondary.main,
        },
      }}
    >
      {children}
    </motion.div>
  );
};
