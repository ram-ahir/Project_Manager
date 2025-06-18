import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Predefined themes
const predefinedThemes = {
  default: {
    name: 'Default Blue',
    gridHeaderStyle: {
      backgroundColor: '#2196F3',
      color: '#FFFFFF',
      gradient: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
    },
    selectedRowStyle: {
      backgroundColor: 'rgba(33, 150, 243, 0.12)',
      color: '#2196F3',
      borderLeft: '4px solid #2196F3',
      borderRight: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      fontWeight: '500',
      fontSize: '1.1rem',
      boxShadow: 'inset 0 0 5px rgba(33, 150, 243, 0.1)',
      transition: 'all 0.3s ease',
      hoverBackgroundColor: 'rgba(33, 150, 243, 0.15)',
      hoverColor: '#2196F3'
    },
    primaryColor: '#2196F3',
    secondaryColor: '#21CBF3'
  },
  dark: {
    name: 'Dark Mode',
    gridHeaderStyle: {
      backgroundColor: '#2c3e50',
      color: '#FFFFFF',
      gradient: 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)'
    },
    selectedRowStyle: {
      backgroundColor: 'rgba(52, 73, 94, 0.15)',
      color: '#ecf0f1',
      borderLeft: '4px solid #3498db',
      borderRight: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      fontWeight: '500',
      fontSize: '1.1rem',
      boxShadow: 'inset 0 0 5px rgba(52, 152, 219, 0.1)',
      transition: 'all 0.3s ease',
      hoverBackgroundColor: 'rgba(52, 73, 94, 0.2)',
      hoverColor: '#ecf0f1'
    },
    primaryColor: '#2c3e50',
    secondaryColor: '#3498db'
  },
  green: {
    name: 'Nature Green',
    gridHeaderStyle: {
      backgroundColor: '#27ae60',
      color: '#FFFFFF',
      gradient: 'linear-gradient(45deg, #27ae60 30%, #2ecc71 90%)'
    },
    selectedRowStyle: {
      backgroundColor: 'rgba(39, 174, 96, 0.12)',
      color: '#27ae60',
      borderLeft: '4px solid #27ae60',
      borderRight: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      fontWeight: '500',
      fontSize: '1.1rem',
      boxShadow: 'inset 0 0 5px rgba(39, 174, 96, 0.1)',
      transition: 'all 0.3s ease',
      hoverBackgroundColor: 'rgba(39, 174, 96, 0.15)',
      hoverColor: '#27ae60'
    },
    primaryColor: '#27ae60',
    secondaryColor: '#2ecc71'
  },
  purple: {
    name: 'Royal Purple',
    gridHeaderStyle: {
      backgroundColor: '#9b59b6',
      color: '#FFFFFF',
      gradient: 'linear-gradient(45deg, #9b59b6 30%, #8e44ad 90%)'
    },
    selectedRowStyle: {
      backgroundColor: 'rgba(155, 89, 182, 0.12)',
      color: '#9b59b6',
      borderLeft: '4px solid #9b59b6',
      borderRight: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      fontWeight: '500',
      fontSize: '1.1rem',
      boxShadow: 'inset 0 0 5px rgba(155, 89, 182, 0.1)',
      transition: 'all 0.3s ease',
      hoverBackgroundColor: 'rgba(155, 89, 182, 0.15)',
      hoverColor: '#9b59b6'
    },
    primaryColor: '#9b59b6',
    secondaryColor: '#8e44ad'
  },
  orange: {
    name: 'Sunset Orange',
    gridHeaderStyle: {
      backgroundColor: '#e67e22',
      color: '#FFFFFF',
      gradient: 'linear-gradient(45deg, #e67e22 30%, #f39c12 90%)'
    },
    selectedRowStyle: {
      backgroundColor: 'rgba(230, 126, 34, 0.12)',
      color: '#e67e22',
      borderLeft: '4px solid #e67e22',
      borderRight: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      fontWeight: '500',
      fontSize: '1.1rem',
      boxShadow: 'inset 0 0 5px rgba(230, 126, 34, 0.1)',
      transition: 'all 0.3s ease',
      hoverBackgroundColor: 'rgba(230, 126, 34, 0.15)',
      hoverColor: '#e67e22'
    },
    primaryColor: '#e67e22',
    secondaryColor: '#f39c12'
  },
  red: {
    name: 'Crimson Red',
    gridHeaderStyle: {
      backgroundColor: '#e74c3c',
      color: '#FFFFFF',
      gradient: 'linear-gradient(45deg, #e74c3c 30%, #c0392b 90%)'
    },
    selectedRowStyle: {
      backgroundColor: 'rgba(231, 76, 60, 0.12)',
      color: '#e74c3c',
      borderLeft: '4px solid #e74c3c',
      borderRight: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      fontWeight: '500',
      fontSize: '1.1rem',
      boxShadow: 'inset 0 0 5px rgba(231, 76, 60, 0.1)',
      transition: 'all 0.3s ease',
      hoverBackgroundColor: 'rgba(231, 76, 60, 0.15)',
      hoverColor: '#e74c3c'
    },
    primaryColor: '#e74c3c',
    secondaryColor: '#c0392b'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [gridHeaderStyle, setGridHeaderStyle] = useState(predefinedThemes.default.gridHeaderStyle);
  const [selectedRowStyle, setSelectedRowStyle] = useState(predefinedThemes.default.selectedRowStyle);
  const [primaryColor, setPrimaryColor] = useState(predefinedThemes.default.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(predefinedThemes.default.secondaryColor);
  const [customTheme, setCustomTheme] = useState({
    gridHeaderStyle: { ...predefinedThemes.default.gridHeaderStyle },
    selectedRowStyle: { ...predefinedThemes.default.selectedRowStyle },
    primaryColor: predefinedThemes.default.primaryColor,
    secondaryColor: predefinedThemes.default.secondaryColor
  });

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('projectManagerTheme');
    const savedCustomTheme = localStorage.getItem('projectManagerCustomTheme');
    
    if (savedTheme && predefinedThemes[savedTheme]) {
      setCurrentTheme(savedTheme);
      setGridHeaderStyle(predefinedThemes[savedTheme].gridHeaderStyle);
      setSelectedRowStyle(predefinedThemes[savedTheme].selectedRowStyle);
      setPrimaryColor(predefinedThemes[savedTheme].primaryColor);
      setSecondaryColor(predefinedThemes[savedTheme].secondaryColor);
    }
    
    if (savedCustomTheme) {
      setCustomTheme(JSON.parse(savedCustomTheme));
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('projectManagerTheme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('projectManagerCustomTheme', JSON.stringify(customTheme));
  }, [customTheme]);

  const applyTheme = (themeName) => {
    if (predefinedThemes[themeName]) {
      setCurrentTheme(themeName);
      setGridHeaderStyle(predefinedThemes[themeName].gridHeaderStyle);
      setSelectedRowStyle(predefinedThemes[themeName].selectedRowStyle);
      setPrimaryColor(predefinedThemes[themeName].primaryColor);
      setSecondaryColor(predefinedThemes[themeName].secondaryColor);
    }
  };

  const updateCustomTheme = (newCustomTheme) => {
    setCustomTheme(newCustomTheme);
    setCurrentTheme('custom');
    setGridHeaderStyle(newCustomTheme.gridHeaderStyle);
    setSelectedRowStyle(newCustomTheme.selectedRowStyle);
    setPrimaryColor(newCustomTheme.primaryColor);
    setSecondaryColor(newCustomTheme.secondaryColor);
  };

  const resetToDefault = () => {
    applyTheme('default');
  };

  return (
    <ThemeContext.Provider value={{
      // Current theme state
      currentTheme,
      gridHeaderStyle,
      selectedRowStyle,
      primaryColor,
      secondaryColor,
      customTheme,
      
      // Theme management functions
      applyTheme,
      updateCustomTheme,
      resetToDefault,
      setGridHeaderStyle,
      setSelectedRowStyle,
      setPrimaryColor,
      setSecondaryColor,
      
      // Available themes
      predefinedThemes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
