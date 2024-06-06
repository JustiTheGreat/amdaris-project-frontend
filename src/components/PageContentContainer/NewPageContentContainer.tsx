import { Box, Tab, Tabs, Tooltip, useTheme } from "@mui/material";
import { FC, createRef, useMemo, useState } from "react";
import { useRefDimensions } from "../../utils/UseRefDimensions";

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
  const slidingContentContainerRef = createRef();
  const dimensions = useRefDimensions(slidingContentContainerRef);

  const isActive = (ti: TabInfo) => ti.content !== undefined && ti.content !== false;
  const activeTabInfoList = useMemo<TabInfo[]>(() => tabInfoList.filter(isActive), [tabInfoList]);
  const [tabInfo, setTabInfo] = useState<TabInfo | undefined>(activeTabInfoList[0]);

  return (
    <Box
      sx={{
        width: { width },
        flex: !width ? 1 : undefined,
        borderRadius: "2rem",
        boxShadow: "20",
        display: "flex",
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          backgroundColor: `${theme.palette.primary.main}`,
          borderTopLeftRadius: "2rem",
          borderBottomLeftRadius: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: `${theme.palette.primary.contrastText}`,
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
            // sx={{ position: "sticky", top: "0" }}
          >
            {tabInfoList
              .filter((ti) => ti.icon)
              .map((ti, i) => (
                <Tab
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
                  sx={{ paddingTop: "2rem", paddingBottom: "2rem" }}
                />
              ))}
          </Tabs>
        )}
      </Box>
      <Box
        ref={slidingContentContainerRef}
        sx={{
          flex: 1,
          backgroundColor: theme.palette.primary.light,
          padding: "1rem",
          borderTopRightRadius: "2rem",
          borderBottomRightRadius: "2rem",
          display: "flex",
          alignItems: "stretch",
          overflow: "hidden",
          justifyContent: children ? "center" : undefined,
        }}
      >
        {children ? (
          children
        ) : (
          <Box
            style={{
              flex: 1,
              display: "flex",
              gap: "2rem",
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
              <Box
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  justifyContent: "center",
                  width: `calc(${dimensions.width}px - 2rem)`,
                }}
              >
                {ti.content}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
