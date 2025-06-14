import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [gridHeaderStyle, setGridHeaderStyle] = useState({
    backgroundColor: '#000080',
    color: '#FFFFFF'
  });

  const [selectedRowStyle, setSelectedRowStyle] = useState({
    backgroundColor: '#FFB302',
    color: '#000000'
  });

  return (
    <ThemeContext.Provider value={{
      gridHeaderStyle,
      selectedRowStyle,
      setGridHeaderStyle,
      setSelectedRowStyle
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
