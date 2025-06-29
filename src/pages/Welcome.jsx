import React from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Avatar,
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        if (option === 'personas') {
            navigate('/login');
        } else if (option === 'empresas') {
            // navega a una ruta futura o muestra un mensaje
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    borderRadius: 4,
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                    textAlign: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: 80,
                            height: 80,
                            mb: 2,
                        }}
                    >
                        <LockIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" component="h1" color="textPrimary" gutterBottom>
                        Gestión de Autenticación
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                        y Autorización
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleOptionClick('personas')}
                    >
                        PERSONAS
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={() => handleOptionClick('empresas')}
                    >
                        EMPRESAS
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Welcome;
