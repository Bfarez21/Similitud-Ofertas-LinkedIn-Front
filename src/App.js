import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, Box, Container } from "@mui/material";
import './App.css';
import Welcome from "./pages/Welcome";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Header from "./components/Header";
import VerificationPage from "./pages/Verification";
import JobRecommender from "./pages/JobRecommender";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verification" element={<VerificationPage/>}/>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Box display="flex" flexDirection="column" minHeight="100vh">
                <Header />
                <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
                  <Home />   {/* Page principal*/}
                </Container>
                <Footer />
              </Box>
            </ProtectedRoute>
          }
        />
        {/* NUEVA RUTA PARA EL RECOMENDADOR */}
        <Route
          path="/recomendarJob"
          element={
            <ProtectedRoute>
              <Box display="flex" flexDirection="column" minHeight="100vh">
                <Header />
                <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
                  <JobRecommender />
                </Container>
                <Footer />
              </Box>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
