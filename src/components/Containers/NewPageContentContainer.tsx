import { Box, Tab, Tabs, Tooltip, useTheme } from "@mui/material";
import { FC, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useRefDimensions } from "../../utils/UseRefDimensions";
import { HoverAnimation } from "../Animations/HoverAnimation";
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
}

export const NewPageContentContainer: FC<NewPageContentContainerProps> = ({
  width = "100%",
  tabInfoList = [],
  children,
}: NewPageContentContainerProps) => {
  const theme = useTheme();
  const slidingContentContainerRef = useRef<Element>();
  const dimensions = useRefDimensions(slidingContentContainerRef);
  const isActive = (ti: TabInfo) => ti.content !== undefined && ti.content !== false;
  const activeTabInfoList = useMemo<TabInfo[]>(() => tabInfoList.filter(isActive), [tabInfoList]);
  const [tabInfo, setTabInfo] = useState<TabInfo | undefined>(activeTabInfoList[0]);

  return (
    <Box
      sx={{
        width: { width },
        flex: !width ? 1 : undefined,
        borderRadius: 10,
        boxShadow: 20,
        display: "flex",
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          backgroundColor: "primary.main",
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "primary.contrastText",
          width: "5rem",
        }}
      >
        {!children && (
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={!tabInfo || tabInfoList.indexOf(tabInfo) === -1 ? false : tabInfoList.indexOf(tabInfo)}
            onChange={(_, value) => setTabInfo(tabInfoList[value])}
            textColor="secondary"
            indicatorColor="secondary"
            // sx={{ position: "sticky", top: "4rem" }}
          >
            {tabInfoList
              .filter((ti) => ti.icon)
              .map((ti, i) => (
                <Tab
                  disabled={!isActive(ti)}
                  value={i}
                  icon={
                    <HoverAnimation key={ti.tooltip}>
                      <Tooltip
                        title={ti.tooltip}
                        placement="left"
                      >
                        {ti.icon}
                      </Tooltip>
                    </HoverAnimation>
                  }
                  sx={(theme) => ({ padding: theme.spacing(4, 0, 4, 0) })}
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
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
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
              transform:
                tabInfo && tabInfoList
                  ? `translateX(${
                      -(activeTabInfoList.indexOf(tabInfo) === -1 ? 0 : activeTabInfoList.indexOf(tabInfo)) *
                      dimensions.width
                    }px)`
                  : undefined,
            }}
          >
            {activeTabInfoList.map((ti) => (
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
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
