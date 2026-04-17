import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";
import { useEffect, useRef, useState } from "react";
import { GetChannelsThunk, SetSelectedChannelActionCreator } from "../../reducers/channel-reducer";
import styles from '../../css/login.module.css'
import { api } from "../../API/api";
import { ChannelUser, MarkDistribution, PostType, Team } from "../../types";
import { GetPostByIdThunk } from "../../reducers/posts-reducer";
const ReallocationOfMarksDialog: React.FC<{ team: Team}> = ({ team}) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [marks, setMarks] = useState<MarkDistribution[]>([]);
    const [error, setError] = useState<string>("");
    const dispatch: any = useDispatch()
 const CuruserId = localStorage.getItem('id');

    const GetDistrbutionMarks = async () =>{
        const data = await api.GetDistrbutionMarks(team.taskId, team.id)
        setMarks(data)
    }
    const OpenDialog = async () =>{
        setOpen(true)
        await GetDistrbutionMarks()
    }

    const handleMarkChange = (userId: number, newMark: number) => {
        setMarks(prevMarks => 
            prevMarks.map(mark => 
                mark.user.id === userId 
                    ? { ...mark, mark: newMark }
                    : mark
            )
        );
    };
    const isUserInCurrentTeam = () => {
        if (team?.users == null) return false;
        return team.users.some((member: any) => member.id == CuruserId);
    };

    const Save = async () =>{
        const marksForApi = marks.map(mark => ({
            userId: mark.user.id,
            mark: mark.mark
        }));
        console.log(marksForApi)
        try
        {
            await api.DistrbuteMarks(team.taskId, marksForApi)
            dispatch(GetPostByIdThunk(team.taskId, PostType.TEAM_TASK))
            setOpen(false)
        }
        catch
        {
            setError("Неправильное перераспределение оценок")
        }
        
    }
    
    return(
        <>
              {isUserInCurrentTeam() && ( <div  style={{marginTop :"10px"}} className='course-block' onClick={OpenDialog}> Распределение оценок</div>)}
           
            {isOpen && (
                <div className="modalOverlay" >
                    <dialog  className='centerpointModal'   >  
                        
                        
                            <div style={{ maxHeight: "300px", overflowY: "auto",}}>
                                {marks.length > 0 ? (
                                    marks.map((mark) => 
                                        <div style={{display : "flex" , gap : "5px"}}>
                                            <p className='baseP' style={{margin : "5px", fontSize :"20px"}} key={mark.user.id} > {mark.user.lastName}  {mark.user.firstName}</p>
                                            <input
                                                            type="number"
                                                            value={mark.mark}
                                                            onChange={(e) => handleMarkChange(
                                                                mark.user.id, 
                                                                Number(e.target.value)
                                                            )}
                                                            min="2"
                                                            max="5"
                                                            step="1"
                                                            style={{ 
                                                                width: "80px", 
                                                                padding: "4px 8px",
                                                                border: "1px solid #ccc",
                                                                borderRadius: "4px"
                                                            }}
                                                        />
                                        </div>
                                )) : 
                                (
                                    team.users.map((user) => 
                                    <div style={{display : "flex" , gap : "5px"}}>
                                        <p className='baseP' style={{margin : "5px", fontSize :"20px"}} key={user.id} > {user.surname}  {user.name}</p>
                                        <input
                                                        type="number"
                                                        value={team.mark}
                                                        onChange={(e) => handleMarkChange(
                                                            user.id, 
                                                            Number(e.target.value)
                                                        )}
                                                        min="2"
                                                        max="5"
                                                        step="1"
                                                        style={{ 
                                                            width: "80px", 
                                                            padding: "4px 8px",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px"
                                                        }}
                                                    />
                                    </div>
                                    )
                                )}
                                
                                
                                
                            </div>

                        <p> {error} </p>
                        
                        <div style={{display : "flex", justifyContent : "flex-end", gap :"5px"}} >
                            
                                <button className={styles.button} type="button" onClick={Save} >
                                    Сохранить 
                                </button>

                            <button className={styles.button} type="button" onClick={() => setOpen(false)} >
                                Отмена
                            </button>
                        </div>
                    
                 </dialog>
                </div>
            )}
        
            
        </>
        
    );
}

export default ReallocationOfMarksDialog;