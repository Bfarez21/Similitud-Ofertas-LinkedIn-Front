import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../src/App.css";
import { API_URL } from "../config";

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    const endpoint = '/auth/signin';
     console.log(API_URL + endpoint);

        try {
            const res = await axios.post( API_URL + endpoint, {
                username,
                password: password,
            });

            localStorage.setItem("token", res.data.token);
            //console.log("token login:", res);
            //navigate("/home");
            navigate("/verification");
        } catch (err) {
            alert("Credenciales inválidas");
        }
    };

    return (
        <div className="App">
            <div className="auth-form-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <label htmlFor="email">email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="tuemail@gmail.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="password">password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Log In</button>
                </form>
                <button className="link-btn" onClick={() => navigate("/register")}>
                    ¿No tienes una cuenta? Regístrate aquí.
                </button>
            </div>
        </div>
    );
}