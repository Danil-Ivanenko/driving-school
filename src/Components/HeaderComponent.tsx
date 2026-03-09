import { useDispatch } from 'react-redux';

import { hasAnyRole, MANAGER, TEACHER } from "../RoleChecker";
import { useTypedSelector } from "../store";
import { useEffect } from 'react';
import { GetMyProfileThunk } from '../reducers/myProfile-reducer';
const HeaderComponent: React.FC = () => {
    const myProfile = useTypedSelector(state => state.myProfile);
    const dispatch: any = useDispatch()
    useEffect(() => {
        dispatch(GetMyProfileThunk())
    }, [])
    const pathname: string = window.location.pathname;

    const signOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userRoles')
        localStorage.removeItem('id')
        window.location.href = "/login"
    };
    return(
            <header className='header'>
               <p className='mainName'> Автошкола</p>
               
    
                <div style={{display: "flex", justifyContent:  "flex-end",  gap:"5px"}}>
                    <div onClick={() => window.location.href = "main"} className='course-block' style={ pathname == "/main" ? {backgroundColor: "#b5d7ed"} : {}} > Курсы</div>
                    
                    {hasAnyRole([MANAGER, TEACHER]) && (
                        <div 
                            className='course-block' 
                            onClick={() => window.location.href = "users"}
                            style={ pathname == "/users" ? {backgroundColor: "#b5d7ed"} : {}}
                        >
                            Пользователи
                        </div> ) }
                    
                    <div onClick={signOut} className='course-block'> {myProfile.profile?.lastName} { myProfile.profile?.firstName } ↩</div>
               </div>
    
               
            </header>
            
    );
}

export default HeaderComponent;