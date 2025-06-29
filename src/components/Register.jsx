import React, { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export const Register = () => {
    const [formData, setFormData] = useState({
        dni: '',
        name: '',
        apellido: '',
        username: '',
        password: '',
        confirmPassword: '',
        respuestaSeguridad: '',
        preguntaId:null,
        imagenId:null
    });

    const [error, setError] = useState('');
    const [pregunta, setPregunta] = useState(null);
    const [respuesta, setRespuesta] = useState(null);
    const [imagenes, setImagenes] = useState([]);
    const navigate = useNavigate();

    // 1. Obtener pregunta e imágenes al cargar
    useEffect(() => {
        axios.get(`${API_URL}/auth/pregunta-imagen-aleatoria`)
            .then(response => {
                const data = response.data;
                // Guarda la pregunta como objeto
                setPregunta({
                    id: data.preguntaId,
                    texto: data.preguntaTexto
                });

                // Guarda la imagen como un array con un solo objeto
                setImagenes([{ idImage: data.imagenId, url: data.imagenUrl }]);

                // También puedes actualizar el formData con los ID si lo deseas
                setFormData(prev => ({
                    ...prev,
                    preguntaId: data.preguntaId,
                    imagenId: data.imagenId
                }));
            })
            .catch(err => {
                console.error("Error al obtener pregunta e imágenes:", err);
                setError("No se pudo cargar la pregunta e imágenes.");
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // envío de datos
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            const endpoint = "/auth/register";
            const response = await axios.post(API_URL + endpoint, {
                dni: formData.dni,
                name: formData.name,
                apellido: formData.apellido,
                username: formData.username,
                password: formData.password,

                // agregar campos verificacion
                respuestaSeguridad: formData.respuestaSeguridad,
                preguntaId: formData.preguntaId,
                imagenId: formData.imagenId
            });
            const {token} = response.data;

            //guardar el token en localstorage para usar el futuras peticiones
            localStorage.setItem('token', token);
            //console.log("token:", token);
            alert("Registro exitoso. Inicia sesión.");

            navigate("/login");
        } catch (err) {
            setError("Error al registrar. Revisa los datos." + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="App">
            <div className="auth-form-container">
                <form className="register-form" onSubmit={handleSubmit}>
                    <h2>Registro</h2>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <label htmlFor="dni">DNI</label>
                    <input
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        placeholder="1234567896"
                        required
                    />

                    <label htmlFor="name">Nombre</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nombre"
                        required
                    />

                    <label htmlFor="apellido">Apellido</label>
                    <input
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        placeholder="Apellido"
                        required
                    />

                    <label htmlFor="username">Email</label>
                    <input
                        name="username"
                        type="email"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="tuuser@gmail.com"
                        required
                    />

                    <label htmlFor="password">Contraseña</label>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                        required
                    />

                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="********"
                        required
                    />

                    {/* Mostrar pregunta */}
                    {pregunta && (
                        <>
                            <label>Pregunta secreta:</label>
                            <p><strong>{pregunta.texto}</strong></p>
                            <input
                                name="respuestaSeguridad"
                                placeholder="Tu respuesta"
                                value={formData.respuestaSeguridad}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}

                    {/* Mostrar imágenes */}
                    {imagenes.length > 0 && (
                        <>
                            <label>Selecciona una imagen:</label>
                            <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
                            {imagenes.map(img => (
                                    <img
                                        key={img.idImage}
                                        src={img.url}
                                        alt="img"
                                        style={{
                                            width: 100,
                                            height: 100,
                                            border: formData.imagenId === img.idImage ? "3px solid blue" : "1px solid gray",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => setFormData(prev => ({ ...prev, imagenId: img.idImage }))}
                                    />
                                ))}
                            </div>
                        </>
                    )}


                    <button type="submit">Registrar</button>
                </form>

                <button className="link-btn" onClick={() => navigate("/login")}>
                    ¿Ya tienes una cuenta? Inicia sesión aquí.
                </button>
            </div>
        </div>
    );
};
