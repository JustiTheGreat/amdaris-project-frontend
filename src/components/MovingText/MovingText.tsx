import { wrap } from "@motionone/utils";
import { Box } from "@mui/material";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  baseVelocity: number;
}

export const ParallaxText = ({ children, baseVelocity = 100 }: ParallaxProps) => {
  const baseX = useMotionValue(0);

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  useAnimationFrame((t, delta) => {
    let moveBy = baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  /**
   * The number of times to repeat the child text should be dynamically calculated
   * based on the size of the text and viewport. Likewise, the x motion value is
   * currently wrapped between -20 and -45% - this 25% is derived from the fact
   * we have four children (100% / 4). This would also want deriving from the
   * dynamically generated number of children.
   */

  return (
    <Box
      sx={{
        overflow: "hidden",
        letterSpacing: (theme) => theme.spacing(-0.7),
        lineHeight: 0.8,
        margin: 0,
        whiteSpace: "nowrap",
        display: "flex",
        flexWrap: "nowrap",
        fontWeight: 900,
        textTransform: "uppercase",
        fontSize: "128px",
        fontFamily: "Plaster, sans-serif",
        color: "secondary.main",
      }}
    >
      <motion.div style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </Box>
  );
};
