import React, { useState } from 'react';
import styles from '../css/login.module.css'
import { api } from '../API/api';
import axios from 'axios';
import { ErrorResponse, tokenResponse } from '../types';


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');


    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault(); 
        const  data  = await api.login(email, password);
        
        if(axios.isAxiosError<ErrorResponse>(data))
        {
            setError(data.response?.data.message || "")
        }
        else if(data as tokenResponse)
        {
            const token = data as tokenResponse
            localStorage.setItem('token',token.token);
            const roles = getUserRolesFromToken(token.token);
            
            localStorage.setItem('userRoles', JSON.stringify(roles));
            window.location.href = '/main'
        }

    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value); 
        setError('');
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value); 
        setError('');
    };

    function getUserRolesFromToken(token: string): string[] {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role || [];
        } catch {
            return [];
        }
    }

    return (
        <div className={styles.App}>
            <div className={styles.container}>
                    <form className={styles['login-form']} onSubmit={handleSubmit }>
                        <p>Вход</p>
                        <div>
                            <label htmlFor="email-input" > &nbsp; E-mail:</label>
                            <input id="email-input"  value={email} onChange={handleEmailChange}/>
                        </div>

                        <div >
                            <label htmlFor="password-input">  &nbsp; Пароль:</label>
                            <input id="password-input" type='password' value={password} onChange={handlePasswordChange}/>
                        </div>

                        <button className={styles.button} type="submit">
                            Войти
                        </button>
                        
                        <b className={styles['error']} >{error}</b>
                    </form>
            </div>
        </div>
    );
};

export default LoginPage;