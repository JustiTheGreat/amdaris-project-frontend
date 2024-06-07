import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

export const VisibilityAnimation: FC<{
  key: string;
  children: ReactNode;
}> = ({ key, children }: { key: string; children: ReactNode }) => {
  return (
    <motion.div
      key={key}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
