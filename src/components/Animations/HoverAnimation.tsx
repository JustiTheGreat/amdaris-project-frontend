import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

export const HoverAnimation: FC<{
  key: string;
  children: ReactNode;
}> = ({ key, children }: { key: string; children: ReactNode }) => {
  return (
    <motion.div
      className="box"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.div>
  );
};
