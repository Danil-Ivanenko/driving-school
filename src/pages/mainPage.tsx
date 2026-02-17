import React, { useState } from 'react';
import '../css/mainPage.css'
import styles from '../css/login.module.css'
const MainPage: React.FC = () => {

    return (
    <div className="app-container">



        <div className={`main-content`}>
            
            <div style={{display: "flex", flexDirection: "column"}}>
                <p className='mainName'> Автошкола</p>
                
            </div>
            
            <div className='containerRow'>
                <div className='containerCol' style={{maxWidth: "500px", maxHeight: '100vh',  overflowY: 'auto'}}>

                    <div className='simpleForm' style={{gap : "10px"}}>
                        
                        <div style={{display: "grid", placeItems : "center", gap : "10px"}}>
                            <p style={{margin : "0px",  fontSize : "16px"}}> Добавить курс</p>
                            <input  />
                            <button className={styles.button} style={{width : "100%"}} >
                                Добавить
                            </button>
                        </div>

                        <div className="course-block">Python-разработчик</div>
                        <div className="course-block">JavaScript-программист </div>
                        <div className="course-block">Web-дизайнер</div>
                      



                    </div>
                    
                </div>


                    <div className='containerCol' style={{ maxHeight: '100vh',   overflowY: 'auto'}}>
                    
                        <div className='simpleForm'>
                            <p> СОздать </p>
                            <textarea style={{maxWidth : "100%", minWidth : "100%"}} >
                               Какой-то текст
                            </textarea>

                        </div>


                            <div className='simpleForm'>
                                <p> Типо карточка</p>

                            <hr className="hr" />
                        </div>
                    </div>

                    
            </div>

        </div>

    </div>
    );
};

export default MainPage