import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    Paper,
    Alert,
    Avatar,
    CircularProgress
} from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import {jwtDecode} from "jwt-decode";

function VerificationPage() {
    const [pregunta, setPregunta] = useState('');
    const [respuesta, setRespuesta] = useState('');
    const [imagenes, setImagenes] = useState([]);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    // useEffect para obtener la pregunta del usuario y las imágenes
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener el token del localStorage
                const token = localStorage.getItem('token');

                // Decodificar el token para obtener el username
                const decoded = jwtDecode(token);
                setUsername(decoded.sub || decoded.username || ''); // accedo al campo

                // Configurar headers con el token
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                // Realizar ambas peticiones en paralelo
                const [preguntaResponse, imagenesResponse] = await Promise.all([
                    axios.get(`${API_URL}/auth/pregunta-asignada-usuario`, config),
                    axios.get(`${API_URL}/banco-image`, config)
                ]);

                // Establecer la pregunta específica del usuario
                setPregunta(preguntaResponse.data.pregunta);
                //console.log("Pregunta del usuario:", preguntaResponse.data.pregunta);

                // Establecer las imágenes aleatoriamente
                //setImagenes(imagenesResponse.data);
                const imagenesMezcladas = [...imagenesResponse.data];
                for (let i = imagenesMezcladas.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [imagenesMezcladas[i], imagenesMezcladas[j]] = [imagenesMezcladas[j], imagenesMezcladas[i]];
                }
                setImagenes(imagenesMezcladas);
                //console.log("Imágenes cargadas:", imagenesResponse.data);

            } catch (error) {
                console.error("Error al obtener los datos", error);

                if (error.response?.status === 401) {
                    setError("Sesión expirada. Por favor, inicie sesión nuevamente.");
                    localStorage.removeItem('token');
                    navigate('/login');
                } else if (error.response?.status === 400) {
                    setError("No se pudo obtener su pregunta de seguridad. Contacte al administrador.");
                } else {
                    setError("No se pudieron cargar los datos de verificación.");
                }
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [navigate]);

    // metodo para segunda verificacion
    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        if (!imagenSeleccionada) {
            setError('Por favor, seleccione una imagen');
            return;
        }

        if (!respuesta.trim()) {
            setError('Por favor, ingrese su respuesta');
            return;
        }

        setLoading(true);

        try {
            // Obtener el token del localStorage
            const token = localStorage.getItem('token');

            // Configurar headers con el token
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            //console.log("Enviando verificación con:", { username, respuesta, imagenId: imagenSeleccionada });
            // Realizar petición de verificación al backend
            const response = await axios.post(`${API_URL}/auth/verificacion-secundaria`, {
                username: username,
                respuesta: respuesta,
                imagenId: imagenSeleccionada
            }, config);

            //console.log("Verificación exitosa:", response.data);

            // Si la verificación es exitosa, navegar al home
            navigate('/home');

        } catch (err) {
            console.error("Error en verificación:", err);

            if (err.response?.status === 401) {
                setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
                localStorage.removeItem('token');
                navigate('/login');
            } else if (err.response?.status === 400) {
                setError('Respuesta o imagen incorrecta. Intente nuevamente.');
            } else {
                setError('Verificación fallida. Revise su respuesta y la imagen seleccionada.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Mostrar loading mientras se cargan los datos
    if (loadingData) {
        return (
            <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box textAlign="center">
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Cargando datos de verificación...
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                <Box textAlign="center" mb={3}>
                    <Avatar
                        alt="Banco Logo"
                        sx={{ width: 64, height: 64, margin: '0 auto', mb: 2 }}
                    />
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        Verificación Adicional
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleVerify}>
                    <Box mb={3}>
                        <Typography variant="subtitle1" mb={1} fontWeight="medium">
                            Pregunta de Seguridad:
                        </Typography>
                        <Typography variant="body1" mb={2} sx={{
                            backgroundColor: '#f5f5f5',
                            padding: 2,
                            borderRadius: 1,
                            fontStyle: 'italic'
                        }}>
                            {pregunta || 'Cargando pregunta...'}
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={respuesta}
                            onChange={(e) => setRespuesta(e.target.value)}
                            placeholder="Ingrese su respuesta"
                            label="Su respuesta"
                            required
                            disabled={!pregunta}
                        />
                    </Box>

                    <Box mb={3}>
                        <Typography variant="subtitle1" mb={1} fontWeight="medium">
                            Seleccione su imagen de seguridad:
                        </Typography>

                        {imagenes.length === 0 ? (
                            <Box textAlign="center" py={3}>
                                <CircularProgress size={40} />
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    Cargando imágenes...
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={2}>
                                {imagenes.map((imagen) => (
                                    <Grid item xs={4} key={imagen.idImage}>
                                        <Box
                                            onClick={() => setImagenSeleccionada(imagen.idImage)}
                                            sx={{
                                                border: imagenSeleccionada === imagen.idImage ? '3px solid #1976d2' : '2px solid #ccc',
                                                borderRadius: 2,
                                                textAlign: 'center',
                                                padding: 1,
                                                cursor: 'pointer',
                                                backgroundColor: imagenSeleccionada === imagen.idImage ? '#e3f2fd' : 'transparent',
                                                userSelect: 'none',
                                                minHeight: '120px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: imagenSeleccionada === imagen.idImage ? '#e3f2fd' : '#f5f5f5'
                                                }
                                            }}
                                        >
                                            <img
                                                src={imagen.imagen}
                                                alt={imagen.nombre}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'contain',
                                                    marginBottom: '8px'
                                                }}
                                            />
                                            <Typography variant="caption" color="textSecondary">
                                                {imagen.nombre}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading || imagenes.length === 0 || !pregunta}
                        sx={{ mt: 2, py: 1.5 }}
                    >
                        {loading ? 'Verificando...' : 'Verificar Identidad'}
                    </Button>
                </form>

                <Box textAlign="center" mt={3}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" color="primary">
                            ¿Problemas para verificar? Volver al inicio de sesión
                        </Typography>
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
}

export default VerificationPage;