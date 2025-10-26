import React from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { guardarUsuario } from '../features/usuario.slice';
import { useRef } from 'react';

const Login = () => {

    const dispatch = useDispatch();

    const userRef = useRef();
    const passwordRef = useRef();

    const login = () => {
        console.log('Iniciar sesión');
        axios.post('http://localhost:3000/v1/auth/login', {
            username: userRef.current.value,
            password: passwordRef.current.value
        })
            .then(response => {
                console.log('Inicio de sesión exitoso:', response.data);
                dispatch(guardarUsuario(response.data.token));
            })
            .catch(error => {
                console.error('Error al iniciar sesión:', error);
            });
    }

    return (
        <div className="login">
            <h2>Iniciar sesión</h2>
            <form>
                <div>
                    <label htmlFor="loginUser">Usuario:</label>
                    <input type="text" id='loginUser' ref={userRef} />
                </div>
                <div>
                    <label htmlFor="loginPassword">Contraseña:</label>
                    <input type="password" id='loginPassword' ref={passwordRef} />
                </div>

                <input type="button" onClick={login} value="Iniciar sesión" />
            </form>
        </div>
    )
}

export default Login