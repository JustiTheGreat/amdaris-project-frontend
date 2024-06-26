import { Box, IconButton, Menu, MenuItem, Tab, Tabs, Toolbar, Tooltip, Typography } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  authenticationPath,
  competitionPath,
  competitorPath,
  gameFormatPath,
  playerPath,
  profileSettingsPath,
  teamPath,
} from "../../utils/PageConstants";
import { UserRole } from "../../utils/UserRoles";
import { AppName, formatCamelCaseToReadable } from "../../utils/Utils";
import { AppContext } from "../App/App";
import { ProfilePictureContainer } from "../PictureContainer/ProfilePictureContainer";

type NavigationTab = typeof competitionPath | typeof playerPath | typeof teamPath | typeof gameFormatPath;
const navigationBarTabs: NavigationTab[] = [competitionPath, playerPath, teamPath, gameFormatPath];
const defaultNavigationTab: NavigationTab = competitionPath;

export const NavigationBar: FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [navigationTab, setNavigationTab] = useState<NavigationTab | undefined>(defaultNavigationTab);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);

  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleGoToPlayerPage = () => {
    if (!user) return;
    navigate(`/${competitorPath}/${user?.playerId}`);
    handleCloseUserMenu();
  };

  const handleGoToProfileSettings = () => {
    if (!user) return;
    navigate(`/${profileSettingsPath}`);
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    setNavigationTab(competitionPath);
    localStorage.removeItem("token");
    navigate(authenticationPath);
    handleCloseUserMenu();
  };

  useEffect(() => {
    if (!navigationBarTabs.includes(location.pathname.slice(1))) setNavigationTab(undefined);
  }, [location.pathname]);

  return (
    <>
      <Toolbar
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: (theme) => theme.spacing(4),
          height: "4rem",
          borderRadius: (theme) => theme.spacing(4),
          position: "sticky",
          top: 0,
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "primary.contrastText" }}
        >
          {AppName}
        </Typography>
        <Tabs
          value={navigationTab ?? false}
          onChange={(_, value) => {
            setNavigationTab(value);
            navigate(`/${value}`);
          }}
          textColor="secondary"
          indicatorColor="secondary"
        >
          {navigationBarTabs.map((nbt) => (
            <Tab
              sx={{
                "&:hover > p": {
                  transform: "scale(1.2)",
                  transitionDuration: "0.3s",
                },
              }}
              key={nbt}
              value={nbt}
              label={
                <Typography
                  variant="body2"
                  sx={{ color: "primary.contrastText" }}
                >
                  {`${formatCamelCaseToReadable(nbt)}s`}
                </Typography>
              }
              onClick={(_) => {
                if (nbt === navigationTab && nbt != location.pathname.slice(1)) {
                  setNavigationTab(nbt);
                  navigate(`/${nbt}`);
                }
              }}
            />
          ))}
        </Tabs>
        <Box sx={{ flex: 1 }}></Box>
        <Box>
          <Tooltip title={`${user?.username}'s menu`}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleOpenUserMenu}
            >
              <IconButton>
                <ProfilePictureContainer src={user?.profilePictureUri ?? null} />
              </IconButton>
              <Typography sx={{ color: "primary.contrastText" }}>{user?.username}</Typography>
            </Box>
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
              <>
                <MenuItem
                  key={"Player page"}
                  onClick={handleGoToPlayerPage}
                >
                  <Typography>My player page</Typography>
                </MenuItem>
                <MenuItem
                  key={"Profile settings"}
                  onClick={handleGoToProfileSettings}
                >
                  <Typography>Profile settings</Typography>
                </MenuItem>
              </>
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
      <Outlet />
    </>
  );
};
