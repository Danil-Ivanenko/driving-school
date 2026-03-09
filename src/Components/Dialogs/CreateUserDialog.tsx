import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetAllUsersThunk } from "../../reducers/user-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { UserRole, ROLES } from "../../types";

const CreateUserDialog: React.FC = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [age, setAge] = useState<number>(18);
    const [phone, setPhone] = useState<string>('');
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([ROLES.STUDENT]);

    const dispatch: any = useDispatch();

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setAge(18);
        setPhone('');
        setSelectedRoles([ROLES.STUDENT]);
        setError('');
    };

    const closeDialog = () => {
        setOpen(false);
        resetForm();
    };

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
        setError('');
    };

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
        setError('');
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setError('');
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setError('');
    };

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(parseInt(event.target.value) || 18);
        setError('');
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
        setError('');
    };


    const handleRoleToggle = (role: UserRole) => {
        if (selectedRoles.includes(role)) {
            if (selectedRoles.length > 1) {
                setSelectedRoles(selectedRoles.filter(r => r !== role));
            }
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
        setError('');
    };

    const validateForm = (): boolean => {
        if (firstName.length < 2) {
            setError("Имя должно содержать минимум 2 символа");
            return false;
        }
        if (lastName.length < 2) {
            setError("Фамилия должна содержать минимум 2 символа");
            return false;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setError("Введите корректный email");
            return false;
        }
        if (password.length < 6) {
            setError("Пароль должен быть не менее 6 символов");
            return false;
        }
        if (age < 16 || age > 100) {
            setError("Возраст должен быть от 16 до 100 лет");
            return false;
        }
        if (phone.length < 10) {
            setError("Введите корректный номер телефона");
            return false;
        }
        if (selectedRoles.length === 0) {
            setError("Выберите хотя бы одну роль");
            return false;
        }
        return true;
    };

    const createNewUser = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await api.createUser({
                firstName,
                lastName,
                email,
                password,
                age,
                phone,
                role: selectedRoles
            });
            
            resetForm();
            setOpen(false);
            dispatch(GetAllUsersThunk());
        } catch (error: any) {
            setError(error.response?.data?.message || "Ошибка при создании пользователя");
        }
    };

    const getRoleName = (role: UserRole): string => {
        switch(role) {
            case ROLES.STUDENT: return "Студент";
            case ROLES.TEACHER: return "Преподаватель";
            case ROLES.MANAGER: return "Менеджер";
            default: return role;
        }
    };

    return (
        <>
            <button className="roundBtn" onClick={() => setOpen(true)} title="Создать пользователя">
                +
            </button>

            {isOpen && (
                <div className="modalOverlay" onClick={closeDialog}>
                    <dialog 
                        className='centerpointModal' 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            minWidth: '400px',
                            position: 'fixed',
                            top: '3%', 
                            left: '50%',
                            transform: 'translateX(-50%)',
                            margin: 0
                        }}
                    >
                        <p style={{ fontSize: "20px", margin: "0 0 20px 0" }}>
                            Создать пользователя
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label htmlFor="firstname-input">Имя *</label>
                                <input 
                                    id="firstname-input" 
                                    value={firstName} 
                                    onChange={handleFirstNameChange}
                                    placeholder="Введите имя"
                                />
                            </div>

                            <div>
                                <label htmlFor="lastname-input">Фамилия *</label>
                                <input 
                                    id="lastname-input" 
                                    value={lastName} 
                                    onChange={handleLastNameChange}
                                    placeholder="Введите фамилию"
                                />
                            </div>

                            <div>
                                <label htmlFor="email-input">Email *</label>
                                <input 
                                    id="email-input" 
                                    type="email"
                                    value={email} 
                                    onChange={handleEmailChange}
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password-input">Пароль *</label>
                                <input 
                                    id="password-input" 
                                    type="password"
                                    value={password} 
                                    onChange={handlePasswordChange}
                                    placeholder="Минимум 6 символов"
                                />
                            </div>

                            <div>
                                <label htmlFor="age-input">Возраст *</label>
                                <input 
                                    id="age-input" 
                                    type="number"
                                    min="16"
                                    max="100"
                                    value={age} 
                                    onChange={handleAgeChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="phone-input">Телефон *</label>
                                <input 
                                    id="phone-input" 
                                    value={phone} 
                                    onChange={handlePhoneChange}
                                    placeholder="+7 (999) 123-45-67"
                                />
                            </div>

                            <div>
                                <label>Роли *</label>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                    {Object.values(ROLES).map((role) => (
                                        <label key={role} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedRoles.includes(role)}
                                                onChange={() => handleRoleToggle(role)}
                                            />
                                            {getRoleName(role)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <b className={styles['error']} style={{ marginTop: '10px', display: 'block' }}>
                                {error}
                            </b>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "5px", marginTop: '20px' }}>
                            <button 
                                className={styles.button} 
                                type="button" 
                                onClick={createNewUser}
                            >
                                Создать
                            </button>
                            
                            <button 
                                className={styles.button} 
                                type="button" 
                                onClick={closeDialog}
                            >
                                Отмена
                            </button>
                        </div>
                    </dialog>
                </div>
            )}
        </>
    );
};

export default CreateUserDialog;