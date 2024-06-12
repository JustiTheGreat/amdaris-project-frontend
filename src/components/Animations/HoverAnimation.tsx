import { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material";

export const HoverAnimation: FC<{
  key?: string;
  children: ReactNode;
}> = ({ key, children }: { key?: string; children: ReactNode }) => {
  const theme = useTheme();
  return (
    <motion.div
      key={key}
      className="box"
      whileHover={{
        scale: 1.2,
        color: theme.palette.secondary.main,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.div>
  );
};
