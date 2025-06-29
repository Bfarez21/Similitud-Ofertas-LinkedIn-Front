import React from 'react';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/welcome');
  };

  const handleJob = () => {
    navigate('/recomendarJob');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1976d2', paddingY: 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Recomendador de Empleo
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<WorkIcon />}
            onClick={handleJob}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: 1,
              '&:hover': { backgroundColor: '#4caf50' }
            }}
          >
            Buscar Trabajo
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: 1,
              backgroundColor: '#e53935',
              '&:hover': { backgroundColor: '#c62828' }
            }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
