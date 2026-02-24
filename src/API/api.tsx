import axios, {AxiosError} from 'axios';
import { tokenResponse, ErrorResponse, Channel } from '../types';


const baseURL ='http://localhost:8080/';
export const instance = axios.create({
    baseURL : baseURL
});


async function login(email : string, password : string){
    try
    {
        const {data, status} = await instance.post<tokenResponse>('auth/login',{
            email: email,
            password: password})

        return(data )
    }
    catch(e)
    {
        return e
    }

}
async function GetChannels()   { 
    try 
    {
        const { data, status } = await instance.get<Channel[]>('channel', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }});
        
        return data
    } 
    catch (e) 
    {
        console.error("Failed to fetch channels:", e);
    }
    
};





export const api = {
    login : login,
    GetChannels : GetChannels
}