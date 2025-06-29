import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import { API_URL } from "../config";

const JobRecommender = () => {
  const [inputText, setInputText] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sanitize = (text) => {
  return text.includes('*') ? 'Información reservada' : text;
  };

  const handleSearch = async () => {
    if (!inputText.trim()) {
      setError('Por favor, ingresa una descripción o título de interés.');
      return;
    }

    setLoading(true);
    setError(null);
    setJobs([]);

    try {

       const token = localStorage.getItem("token"); 

      const response = await axios.post(
        `${API_URL}/api/recomendacion/buscar`,
        { text: inputText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setJobs(response.data);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al comunicarse con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '6rem' }}>
      <Typography variant="h4" gutterBottom>
        Recomendador de Ofertas Laborales
      </Typography>

      <TextField
        label="Describe tu empleo ideal"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Buscar Empleos'}
      </Button>

      {error && <Alert severity="error" style={{ marginTop: '1rem' }}>{error}</Alert>}

      {jobs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <Typography variant="h6" gutterBottom>
            Resultados recomendados:
          </Typography>
          <Grid container spacing={2}>
            {jobs.map((job, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: '#f5faff',
                    borderRadius: 3,
                    boxShadow: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                      {sanitize(job.title)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
                      {sanitize(job.company)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                      {sanitize(job.location)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {sanitize(job.description)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </Container>
  );
};

export default JobRecommender;
