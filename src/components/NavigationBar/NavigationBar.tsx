import { AccountCircle } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Tab, Tabs, Toolbar, Tooltip, Typography, useTheme } from "@mui/material/";
import { FC, useContext, useState } from "react";
import {
  authenticationPath,
  competitionPath,
  competitorPath,
  gameFormatPath,
  playerPath,
  teamPath,
} from "../../utils/PageConstants";
import { formatCamelCaseToReadable } from "../../utils/Utils";
import { AppContext } from "../App/App";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../utils/UserRoles";

type NavigationTab = typeof competitionPath | typeof playerPath | typeof teamPath | typeof gameFormatPath;
const navigationBarTabs: NavigationTab[] = [competitionPath, playerPath, teamPath, gameFormatPath];
const defaultNavigationTab: NavigationTab = competitionPath;

export const NavigationBar: FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, setToken, doReload } = useContext(AppContext);
  const [navigationTab, setNavigationTab] = useState<NavigationTab>(defaultNavigationTab);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);

  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleGoToPlayerPage = () => {
    if (!user) return;
    navigate(`/${competitorPath}/${user?.playerId}`);
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    setNavigationTab(competitionPath);
    setToken(undefined);
    navigate(authenticationPath);
    handleCloseUserMenu();
  };

  return (
    <Toolbar
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        columnGap: "5rem",
        height: "4rem",
        margin: "0 0 3rem 0",
        borderRadius: "1rem",
        position: "sticky",
        top: "0",
        zIndex: "1",
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: theme.palette.primary.contrastText }}
      >
        APProject
      </Typography>
      <Tabs
        value={navigationTab}
        onChange={(_, value) => {
          setNavigationTab(value);
          navigate(`/${value}`);
          doReload();
        }}
        textColor="secondary"
        indicatorColor="secondary"
      >
        {navigationBarTabs.map((nbt) => (
          <Tab
            value={nbt}
            label={formatCamelCaseToReadable(nbt)}
            onClick={(_) => {
              if (nbt === navigationTab && nbt != location.pathname.slice(1)) {
                setNavigationTab(nbt);
                navigate(`/${nbt}`);
                doReload();
              }
            }}
          />
        ))}
      </Tabs>
      <Box sx={{ flex: "1" }}></Box>
      <Box>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu}>
            <AccountCircle color={"secondary"} />
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {user && user.role === UserRole.User && (
            <MenuItem
              key={"Player page"}
              onClick={handleGoToPlayerPage}
            >
              <Typography>My player page</Typography>
            </MenuItem>
          )}
          <MenuItem
            key={"Logout"}
            onClick={handleLogout}
          >
            <Typography>Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  );
};
