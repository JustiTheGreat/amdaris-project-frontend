import { Box } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { addZeroBefore } from "../../utils/Utils";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";

interface TimerProps {
  untilDate: Date;
}

export const Timer: FC<TimerProps> = ({ untilDate }: TimerProps) => {
  const [time, setTime] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const setTimeState = () => {
      if (!untilDate) return;
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const untilTime = Math.floor(new Date(untilDate).getTime() / 1000);
      const remainingTime = untilTime - currentTime;
      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime % 3600) / 60);
      const seconds = Math.floor(remainingTime % 60);
      setTime({ hours: hours < 0 ? 0 : hours, minutes: minutes < 0 ? 0 : minutes, seconds: seconds < 0 ? 0 : seconds });
    };

    setTimeState();

    const timer = setInterval(setTimeState, 1000);
    return () => clearInterval(timer);
  }, [untilDate]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: (theme) => theme.spacing(2),
        padding: (theme) => theme.spacing(0, 2, 0, 2),
        borderRadius: 5,
        backgroundColor: "primary.main",
        color: time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0 ? "error.main" : "primary.contrastText",
        fontSize: "24px",
        height: "3rem",
      }}
    >
      <VisibilityAnimation key={`timerHours${time.hours}`}>{addZeroBefore(time.hours)}</VisibilityAnimation>
      <>:</>
      <VisibilityAnimation key={`timerMinutes${time.minutes}`}>{addZeroBefore(time.minutes)}</VisibilityAnimation>
      <>:</>
      <VisibilityAnimation key={`timerSeconds${time.seconds}`}>{addZeroBefore(time.seconds)}</VisibilityAnimation>
    </Box>
  );
};
