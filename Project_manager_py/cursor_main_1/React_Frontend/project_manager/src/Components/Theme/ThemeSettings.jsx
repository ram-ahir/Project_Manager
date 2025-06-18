import React, { useState } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  Switch,
  FormControlLabel,
  ClickAwayListener
} from '@mui/material';
import {
  Palette as PaletteIcon,
  ColorLens as ColorLensIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Check as CheckIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { SketchPicker } from 'react-color';

const ThemeSettings = () => {
  const {
    currentTheme,
    gridHeaderStyle,
    selectedRowStyle,
    primaryColor,
    secondaryColor,
    customTheme,
    predefinedThemes,
    applyTheme,
    updateCustomTheme,
    resetToDefault,
    setGridHeaderStyle,
    setSelectedRowStyle,
    setPrimaryColor,
    setSecondaryColor
  } = useTheme();

  const [showPreview, setShowPreview] = useState(true);
  const [activeColorPicker, setActiveColorPicker] = useState(null);

  const handleColorChange = (type, color) => {
    const newCustomTheme = { ...customTheme };
    
    switch (type) {
      case 'header':
        newCustomTheme.gridHeaderStyle = { ...newCustomTheme.gridHeaderStyle, backgroundColor: color.hex };
        setGridHeaderStyle({ ...gridHeaderStyle, backgroundColor: color.hex });
        break;
      case 'headerText':
        newCustomTheme.gridHeaderStyle = { ...newCustomTheme.gridHeaderStyle, color: color.hex };
        setGridHeaderStyle({ ...gridHeaderStyle, color: color.hex });
        break;
      case 'row':
        newCustomTheme.selectedRowStyle = { ...newCustomTheme.selectedRowStyle, backgroundColor: color.hex };
        setSelectedRowStyle({ ...selectedRowStyle, backgroundColor: color.hex });
        break;
      case 'rowText':
        newCustomTheme.selectedRowStyle = { ...newCustomTheme.selectedRowStyle, color: color.hex };
        setSelectedRowStyle({ ...selectedRowStyle, color: color.hex });
        break;
      case 'rowBorder':
        newCustomTheme.selectedRowStyle = { ...newCustomTheme.selectedRowStyle, borderLeft: `4px solid ${color.hex}` };
        setSelectedRowStyle({ ...selectedRowStyle, borderLeft: `4px solid ${color.hex}` });
        break;
      case 'rowHoverBg':
        newCustomTheme.selectedRowStyle = { ...newCustomTheme.selectedRowStyle, hoverBackgroundColor: color.hex };
        setSelectedRowStyle({ ...selectedRowStyle, hoverBackgroundColor: color.hex });
        break;
      case 'rowHoverText':
        newCustomTheme.selectedRowStyle = { ...newCustomTheme.selectedRowStyle, hoverColor: color.hex };
        setSelectedRowStyle({ ...selectedRowStyle, hoverColor: color.hex });
        break;
      case 'primary':
        newCustomTheme.primaryColor = color.hex;
        setPrimaryColor(color.hex);
        break;
      case 'secondary':
        newCustomTheme.secondaryColor = color.hex;
        setSecondaryColor(color.hex);
        break;
      default:
        break;
    }
    
    updateCustomTheme(newCustomTheme);
  };

  const handlePredefinedTheme = (themeName) => {
    applyTheme(themeName);
  };

  const ThemeCard = ({ themeName, theme }) => (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: currentTheme === themeName ? '3px solid' : '1px solid',
        borderColor: currentTheme === themeName ? 'primary.main' : 'divider',
        transform: currentTheme === themeName ? 'scale(1.05)' : 'scale(1)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 4,
        },
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => handlePredefinedTheme(themeName)}
    >
      {currentTheme === themeName && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
        </Box>
      )}
      
      <Box
        sx={{
          height: 60,
          background: theme.gridHeaderStyle.gradient || theme.gridHeaderStyle.backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.gridHeaderStyle.color
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {theme.name}
        </Typography>
      </Box>
      
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: theme.primaryColor,
              border: '2px solid white',
              boxShadow: 1
            }}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: theme.secondaryColor,
              border: '2px solid white',
              boxShadow: 1
            }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {themeName === 'default' ? 'Classic blue theme' :
           themeName === 'dark' ? 'Professional dark mode' :
           themeName === 'green' ? 'Nature-inspired green' :
           themeName === 'purple' ? 'Elegant purple design' :
           themeName === 'orange' ? 'Warm sunset colors' :
           'Bold crimson red theme'}
        </Typography>
      </CardContent>
    </Card>
  );

  const ColorPickerButton = ({ label, color, type, icon }) => (
    <Box sx={{ position: 'relative' }}>
      <Button
        variant="outlined"
        startIcon={icon}
        onClick={() => setActiveColorPicker(activeColorPicker === type ? null : type)}
        sx={{
          borderColor: color,
          color: color,
          '&:hover': {
            borderColor: color,
            backgroundColor: alpha(color, 0.08),
          },
          minWidth: 140,
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: color,
            border: '2px solid white',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
            mr: 1
          }}
        />
        {label}
      </Button>
      
      {activeColorPicker === type && (
        <ClickAwayListener onClickAway={() => setActiveColorPicker(null)}>
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 1000,
              mt: 1,
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            <SketchPicker
              color={color}
              onChange={(color) => handleColorChange(type, color)}
              disableAlpha
              presetColors={[
                '#D0021B', '#F5A623', '#F8E71C', '#7ED321', '#417505',
                '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986',
                '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'
              ]}
            />
          </Box>
        </ClickAwayListener>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600,
          background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <PaletteIcon fontSize="large" />
          Theme Customization
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Personalize your project manager with beautiful themes and custom colors
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Predefined Themes */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AutoAwesomeIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Predefined Themes
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {Object.entries(predefinedThemes).map(([themeName, theme]) => (
                <Grid item xs={12} sm={6} md={4} key={themeName}>
                  <ThemeCard themeName={themeName} theme={theme} />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={resetToDefault}
                sx={{
                  background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${primaryColor} 40%, ${secondaryColor} 100%)`,
                  }
                }}
              >
                Reset to Default
              </Button>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showPreview}
                    onChange={(e) => setShowPreview(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Live Preview"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Custom Color Settings */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <ColorLensIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Custom Color Settings
              </Typography>
              <Chip 
                label="Custom Theme" 
                color="primary" 
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Header Colors
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ColorPickerButton
                    label="Header Background"
                    color={gridHeaderStyle.backgroundColor}
                    type="header"
                    icon={<PaletteIcon />}
                  />
                  <ColorPickerButton
                    label="Header Text"
                    color={gridHeaderStyle.color}
                    type="headerText"
                    icon={<ColorLensIcon />}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Row Colors
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ColorPickerButton
                    label="Selected Row Background"
                    color={selectedRowStyle.backgroundColor}
                    type="row"
                    icon={<PaletteIcon />}
                  />
                  <ColorPickerButton
                    label="Selected Row Text"
                    color={selectedRowStyle.color}
                    type="rowText"
                    icon={<ColorLensIcon />}
                  />
                  <ColorPickerButton
                    label="Selected Row Border"
                    color={selectedRowStyle.borderLeft?.replace('4px solid ', '') || primaryColor}
                    type="rowBorder"
                    icon={<ColorLensIcon />}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Row Hover Colors
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ColorPickerButton
                    label="Hover Background"
                    color={selectedRowStyle.hoverBackgroundColor || alpha(primaryColor, 0.15)}
                    type="rowHoverBg"
                    icon={<PaletteIcon />}
                  />
                  <ColorPickerButton
                    label="Hover Text Color"
                    color={selectedRowStyle.hoverColor || primaryColor}
                    type="rowHoverText"
                    icon={<ColorLensIcon />}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Primary Colors
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ColorPickerButton
                    label="Primary Color"
                    color={primaryColor}
                    type="primary"
                    icon={<PaletteIcon />}
                  />
                  <ColorPickerButton
                    label="Secondary Color"
                    color={secondaryColor}
                    type="secondary"
                    icon={<ColorLensIcon />}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Live Preview */}
        {showPreview && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <PreviewIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Live Preview
                </Typography>
              </Box>
              
              <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: gridHeaderStyle.gradient || gridHeaderStyle.backgroundColor }}>
                      <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600 }}>
                        Project Name
                      </TableCell>
                      <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600 }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600 }}>
                        Database
                      </TableCell>
                      <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600 }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Sample Project</TableCell>
                      <TableCell>This is a normal row</TableCell>
                      <TableCell>MySQL</TableCell>
                      <TableCell>
                        <Chip label="Active" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                    <TableRow sx={selectedRowStyle}>
                      <TableCell sx={{ color: selectedRowStyle.color, fontWeight: 500 }}>
                        Selected Project
                      </TableCell>
                      <TableCell sx={{ color: selectedRowStyle.color }}>
                        This row shows selected state
                      </TableCell>
                      <TableCell sx={{ color: selectedRowStyle.color }}>
                        PostgreSQL
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="Selected" 
                          sx={{ 
                            backgroundColor: selectedRowStyle.color,
                            color: selectedRowStyle.backgroundColor
                          }} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Another Project</TableCell>
                      <TableCell>Another normal row</TableCell>
                      <TableCell>MongoDB</TableCell>
                      <TableCell>
                        <Chip label="Pending" color="warning" size="small" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ThemeSettings;
