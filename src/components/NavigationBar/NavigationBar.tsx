import { AccountCircle } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Tab, Tabs, Toolbar, Tooltip, Typography } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  authenticationPath,
  competitionPath,
  competitorPath,
  gameFormatPath,
  playerPath,
  teamPath,
} from "../../utils/PageConstants";
import { UserRole } from "../../utils/UserRoles";
import { formatCamelCaseToReadable } from "../../utils/Utils";
import { AppContext } from "../App/App";

type NavigationTab = typeof competitionPath | typeof playerPath | typeof teamPath | typeof gameFormatPath;
const navigationBarTabs: NavigationTab[] = [competitionPath, playerPath, teamPath, gameFormatPath];
const defaultNavigationTab: NavigationTab = competitionPath;

export const NavigationBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    <Toolbar
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: (theme) => theme.spacing(10),
        height: "4rem",
        margin: (theme) => theme.spacing(0, 0, 8, 0),
        borderRadius: 10,
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: "primary.contrastText" }}
      >
        APProject
      </Typography>
      <Tabs
        value={navigationTab}
        onChange={(_, value) => {
          setNavigationTab(value);
          navigate(`/${value}`);
        }}
        textColor="secondary"
        indicatorColor="secondary"
      >
        {navigationBarTabs.map((nbt) => (
          <Tab
            key={nbt}
            value={nbt}
            label={formatCamelCaseToReadable(nbt)}
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
