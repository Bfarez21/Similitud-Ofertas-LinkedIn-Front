import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config";
/* 
Usa componentes de Material UI para renderizar una tabla elegante.
Usa Typography, TableContainer, Table, y Button de MUI.
Respeta la seguridad con JWT (token en header).
Redirige si el token no existe o expira.
*/
export default function Home() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUsuarios = async () => {
      try {
        const res = await fetch(`${API_URL}/usuarios`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          // console.log('Datos obtenidos:',data);
          setUsuarios(data);
        } else {
          console.error("Error al obtener usuarios:", res.status);
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("Error de red:", err);
      }
    };

    fetchUsuarios();
  }, [navigate, token]);


  return (
    <div style={{ padding: '64px' }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Home
      </Typography>
      <Typography variant="body1" gutterBottom>
        Esta es una aplicación con <strong>React JSX</strong> y autenticación con <strong>JWT</strong>.
      </Typography>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Lista de Usuarios
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Correo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((user) => (
              <TableRow key={user.idusuario}>
                <TableCell>{user.idusuario}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.apellido}</TableCell>
                <TableCell>{user.dni}</TableCell>
                <TableCell>{user.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}