import { Box, Tab, Tabs, Tooltip, useTheme } from "@mui/material";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useRefDimensions } from "../../utils/UseRefDimensions";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";

export interface TabInfo {
  tooltip: string;
  icon: JSX.Element;
  content?: JSX.Element | false;
}

interface NewPageContentContainerProps {
  width?: string;
  tabInfoList?: TabInfo[];
  children?: JSX.Element;
  firstTabSwitch?: boolean;
}

export const NewPageContentContainer: FC<NewPageContentContainerProps> = ({
  width,
  tabInfoList = [],
  children,
  firstTabSwitch,
}: NewPageContentContainerProps) => {
  const theme = useTheme();
  const slidingContentContainerRef = useRef<Element>();
  const dimensions = useRefDimensions(slidingContentContainerRef);

  const isActive = (ti: TabInfo) => ti.content !== undefined && ti.content !== false;
  const activeTabInfoList = useMemo(() => tabInfoList.filter(isActive), [tabInfoList]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  useEffect(() => setActiveTabIndex(0), [firstTabSwitch]);

  return (
    <Box
      sx={{
        width: width ?? "100%",
        minHeight: !width ? (theme) => `calc(100vh - 4rem - ${theme.spacing(8)})` : undefined,
        maxHeight: !width ? (theme) => `calc(100vh - 4rem - ${theme.spacing(8)})` : undefined,
        borderRadius: theme.spacing(4),
        boxShadow: 20,
        display: "flex",
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          backgroundColor: "primary.main",
          borderTopLeftRadius: (theme) => theme.spacing(4),
          borderBottomLeftRadius: (theme) => theme.spacing(4),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "primary.contrastText",
          width: (theme) => theme.spacing(10),
        }}
      >
        {!children && (
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={activeTabIndex}
            onChange={(_, value) => setActiveTabIndex(value)}
            textColor="secondary"
            indicatorColor="secondary"
          >
            {tabInfoList
              .filter((ti) => ti.icon)
              .map((ti, i) => (
                <Tab
                  sx={{
                    padding: (theme) => theme.spacing(3, 0, 3, 0),
                    "&:hover .MuiSvgIcon-root": {
                      transform: "scale(1.3)",
                      transitionDuration: "2s !important",
                    },
                  }}
                  disabled={!isActive(ti)}
                  value={i}
                  icon={
                    <Tooltip
                      title={ti.tooltip}
                      placement="left"
                    >
                      {ti.icon}
                    </Tooltip>
                  }
                />
              ))}
          </Tabs>
        )}
      </Box>
      <Box
        ref={slidingContentContainerRef}
        sx={{
          flex: 1,
          backgroundColor: "primary.light",
          borderTopRightRadius: (theme) => theme.spacing(4),
          borderBottomRightRadius: (theme) => theme.spacing(4),
          display: "flex",
          alignItems: "stretch",
          overflow: "hidden",
          justifyContent: children ? "center" : undefined,
        }}
      >
        {children || tabInfoList.length === 0 ? (
          <VisibilityAnimation
            key={location.pathname}
            style={{ flex: 1, padding: theme.spacing(2) }}
          >
            {children ? children : <Outlet />}
          </VisibilityAnimation>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              gap: (theme) => theme.spacing(2),
              flexWrap: "nowrap",
              transition: "transform ease-out 0.5s",
              width: activeTabInfoList.length * dimensions.width,
              transform: () =>
                `translateX(${-activeTabInfoList.indexOf(tabInfoList[activeTabIndex]) * dimensions.width}px)`,
            }}
          >
            {activeTabInfoList.map((ti) => {
              return (
                <VisibilityAnimation
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    justifyContent: "center",
                    padding: useTheme().spacing(2),
                    width: `calc(${dimensions.width}px )`,
                  }}
                >
                  {ti.content}
                </VisibilityAnimation>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};
