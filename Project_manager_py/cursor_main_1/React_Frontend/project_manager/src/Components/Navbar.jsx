import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Badge,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Folder as FolderIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

const Navbar = ({ currentProject }) => {
  const theme = useTheme();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [projectMenuAnchor, setProjectMenuAnchor] = useState(null);
  const [notifications] = useState([
    { id: 1, message: 'Project "E-commerce" updated successfully', time: '2 min ago' },
    { id: 2, message: 'New table "users" created', time: '5 min ago' }
  ]);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProjectMenuOpen = (event) => {
    setProjectMenuAnchor(event.currentTarget);
  };

  const handleProjectMenuClose = () => {
    setProjectMenuAnchor(null);
  };

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section - Brand and Project */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Brand */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Project Manager
          </Typography>

         
          

          {/* Current Project */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderIcon sx={{ color: alpha(theme.palette.common.white, 0.8) }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: alpha(theme.palette.common.white, 0.9),
                fontWeight: 500
              }}
            >
              {currentProject?.project_name || 'No project selected'}
            </Typography>
            {currentProject && (
              <Chip
                label="Active"
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.2),
                  color: theme.palette.success.light,
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
            )}
          </Box>
        </Box>

        {/* Right Section - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <Tooltip title="Notifications" arrow>
            <IconButton
              color="inherit"
              sx={{
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                }
              }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="User menu" arrow>
            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                }
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>

          {/* User Menu Dropdown */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: `1px solid ${theme.palette.divider}`
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleUserMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Profile" 
                secondary="View your profile"
              />
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                secondary="Manage your preferences"
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleUserMenuClose}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
