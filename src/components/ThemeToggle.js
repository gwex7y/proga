// components/ThemeToggle.js
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ThemeToggle = ({ size = 'medium', sx = {} }) => {
  const { toggleTheme, mode } = useContext(AuthContext);

  return (
    <Tooltip title={mode === 'light' ? 'Темная тема' : 'Светлая тема'}>
      <IconButton 
        onClick={toggleTheme}
        size={size}
        sx={{
          color: 'inherit',
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.1)' 
          },
          ...sx
        }}
      >
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;