import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TableChart as TableChartIcon,
  Description as DescriptionIcon,
  Palette as PaletteIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import Project from './Project/Project';
import Tables from './Table/Tables';
import ThemeSettings from './Theme/ThemeSettings';

const Adminpanel = ({ currentProject, setcurrentProject }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeItem, setActiveItem] = useState('Project');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Navigation items with icons
  const navItems = [
    { 
      id: 'Project', 
      label: 'Projects', 
      icon: <DashboardIcon />,
      description: 'Manage your projects'
    },
    { 
      id: 'Tables', 
      label: 'Tables', 
      icon: <TableChartIcon />,
      description: 'Manage database tables',
      disabled: !currentProject
    },
    { 
      id: 'Forms', 
      label: 'Forms', 
      icon: <DescriptionIcon />,
      description: 'Manage forms',
      disabled: !currentProject
    },
    { 
      id: 'Theme', 
      label: 'Theme', 
      icon: <PaletteIcon />,
      description: 'Customize appearance'
    }
  ];

  // Update breadcrumbs when active item or project changes
  useEffect(() => {
    const newBreadcrumbs = [
      { label: 'Home', icon: <HomeIcon fontSize="small" />, path: 'Project' }
    ];

    if (activeItem !== 'Project') {
      newBreadcrumbs.push({
        label: activeItem,
        icon: navItems.find(item => item.id === activeItem)?.icon,
        path: activeItem
      });
    }

    if (currentProject && activeItem !== 'Project') {
      newBreadcrumbs.push({
        label: currentProject.project_name,
        icon: null,
        path: null
      });
    }

    setBreadcrumbs(newBreadcrumbs);
  }, [activeItem, currentProject]);

  const handleNavigation = (itemId) => {
    setActiveItem(itemId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'Project':
        return (
          <Project currentProject={currentProject} setcurrentProject={setcurrentProject} />
        );
      case 'Tables':
        return (
          <Tables project={currentProject} />
        );
      case 'Forms':
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Forms Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Manage your application forms here. This feature is coming soon.
            </Typography>
            <Chip 
              label="Coming Soon" 
              color="primary" 
              variant="outlined"
              sx={{ borderRadius: '20px' }}
            />
          </Box>
        );
      case 'Theme':
        return (
          <ThemeSettings />
        );
      default:
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome to Project Manager
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select a section from the sidebar to get started.
            </Typography>
          </Box>
        );
    }
  };

  const drawerWidth = 280;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <Tooltip 
              title={item.description} 
              placement="right"
              disableHoverListener={!isMobile}
            >
              <ListItemButton
                onClick={() => handleNavigation(item.id)}
                disabled={item.disabled}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  backgroundColor: activeItem === item.id 
                    ? alpha(theme.palette.primary.main, 0.1) 
                    : 'transparent',
                  color: activeItem === item.id 
                    ? theme.palette.primary.main 
                    : theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: activeItem === item.id
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.action.hover, 0.1),
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: activeItem === item.id 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: activeItem === item.id ? 600 : 400
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="caption" color="text.secondary" align="center">
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)', // Subtract navbar height
      position: 'relative'
    }}>
      {/* Floating Toggle Button - Always visible on right side of drawer */}
      {!isMobile && (
        <Box sx={{
          position: 'fixed',
          left: sidebarOpen ? drawerWidth : 0,
          top: '7.5%',
          transform: 'translateY(-50%)',
          zIndex: 1300,
          mt: '32px', // Account for navbar height
          transition: 'left 0.3s ease'
        }}>
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              borderRadius: '0 8px 8px 0',
              boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                // transform: 'translateX(2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: theme.palette.background.paper,
              top: '64px', // Account for navbar height
              height: 'calc(100vh - 64px)'
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: sidebarOpen ? drawerWidth : 0,
              background: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
              top: '64px', // Account for navbar height
              height: 'calc(100vh - 64px)',
              position: 'fixed',
              overflow: 'hidden',
              transition: 'width 0.3s ease'
            },
          }}
          open={sidebarOpen}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0, // Prevent content overflow
        marginLeft: { xs: 0, md: sidebarOpen ? `${drawerWidth}px` : 0 }, // Dynamic margin based on sidebar state
        transition: 'margin-left 0.3s ease'
      }}>
        

        {/* Content Area */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          backgroundColor: theme.palette.background.default,
          position: 'relative'
        }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default Adminpanel;
