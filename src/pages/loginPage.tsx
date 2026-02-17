import React, { useState } from 'react';
import styles from '../css/login.module.css'
// import styles from './Login.module.css'; 


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');


    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault(); 
        if (email == "123")
        {
            setError("Error")
        }
        else
        {
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
                            <input id="password-input" value={password} onChange={handlePasswordChange}/>
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