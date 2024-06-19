import { FC, ReactNode } from "react";
import { MotionStyle, motion } from "framer-motion";
import { Outlet } from "react-router-dom";

export const VisibilityAnimation: FC<{
  key?: string;
  children?: ReactNode;
  style?: MotionStyle;
}> = ({ key, children, style }: { key?: string; children?: ReactNode; style?: MotionStyle }) => {
  return (
    <motion.div
      key={key}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={style}
    >
      {children ? children : <Outlet />}
    </motion.div>
  );
};
