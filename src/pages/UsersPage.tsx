import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllUsersThunk, DeleteUserThunk } from '../reducers/user-reducer';
import { FullInfo } from '../types';
import type { ThunkDispatch } from 'redux-thunk';
import type { AnyAction } from 'redux';
import type { RootState } from '../store';
import CreateUserDialog from '../Components/Dialogs/CreateUserDialog';
import { hasAnyRole, MANAGER, TEACHER } from '../RoleChecker';
import HeaderComponent from '../Components/HeaderComponent';

type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const UsersPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { users, loading, error } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        dispatch(GetAllUsersThunk());
    }, [dispatch]);

    if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
    if (error) return <div style={{ padding: '20px' }}>Ошибка: {error}</div>;

    return (
        <div className="app-container">
            
        <HeaderComponent />
        <div style={{ padding: '20px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px'
            }}>
                <h2 style={{ margin: 0 }}>Список пользователей</h2> 
                <CreateUserDialog /> 
            </div>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '20px',
            }}>
                {users.map((user: FullInfo) => (
                    <div 
                        key={user.id}
                        style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            borderRadius: '8px',
                            backgroundColor: user.isActive ? '#fff' : '#f9f9f9',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default',
                            opacity: user.isActive ? 1 : 0.7
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#007bff',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}>
                            {user.firstName[0]}{user.lastName[0]}
                        </div>

                        <div style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '8px'
                        }}>
                            {user.firstName} {user.lastName}
                        </div>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr',
                            gap: '5px',
                            fontSize: '14px'
                        }}>
                            <div><strong>Email:</strong> {user.email}</div>
                            <div><strong>Телефон:</strong> {user.phone}</div>
                            <div><strong>Возраст:</strong> {user.age}</div>
                            <div><strong>Роли:</strong> {user.role.join(', ')}</div>
                            <div>
                                <strong>Статус:</strong> 
                                <span style={{ 
                                    color: user.isActive ? '#28a745' : '#dc3545',
                                    marginLeft: '5px',
                                    fontWeight: 'bold'
                                }}>
                                    {user.isActive ? 'Активен' : 'Неактивен'}
                                </span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => dispatch(DeleteUserThunk(user.id))}
                            style={{
                                marginTop: '10px',
                                padding: '8px 12px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                width: '100%',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                        >
                            Удалить
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
};

export default UsersPage;