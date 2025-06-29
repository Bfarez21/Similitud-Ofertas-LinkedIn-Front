// src/components/Footer.jsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#2121dd',
        color: '#fff',
        py: 3,
        mt: 'auto',
        textAlign: 'center',
      }}
      component="footer"
    >
      <Container maxWidth="md">
        <Typography variant="body1">
          © {new Date().getFullYear()} Proyecto con React + JWT | Material UI
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Desarrollado por Bryan Farez
        </Typography>
      </Container>
    </Box>
  );
}
