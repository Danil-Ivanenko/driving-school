import { Dispatch } from "redux"
import { Channel, ChannelUser } from "../types";
import { api } from "../API/api";



interface GetChannelsAction {
    type: typeof GET_CHANNELS,
    payload: Channel[]
}

interface SetSelectedChannelAction {
    type: typeof SET_SELECTED_CHANNEL,
    payload: Channel | null
}

interface GetSelectedChannelUsersAction {
    type: typeof GET_SELECTED_CHANNEL_USERS,
    payload: ChannelUser[]
}


export type ChannelActions = GetChannelsAction | SetSelectedChannelAction | GetSelectedChannelUsersAction;

export const GET_CHANNELS = 'GET_CHANNELS'; 
export const SET_SELECTED_CHANNEL = 'SET_SELECTED_CHANNEL'; 
export const GET_SELECTED_CHANNEL_USERS = 'GET_SELECTED_CHANNEL_USERS';

type ChannelState = {
    channels: Channel[],
    selectedChannel: Channel | null,
    selectedChannelUsers: ChannelUser[]
};

const initialState: ChannelState = {
      channels: [],
      selectedChannel: null,
      selectedChannelUsers : []
};

export const channelReducer = (
      state: ChannelState = initialState,
      action: ChannelActions
): ChannelState => {
      switch (action.type) {

        case GET_CHANNELS:
            return {
            ...state,
            channels : action.payload
            };
        case SET_SELECTED_CHANNEL:
            return {
                ...state,
                selectedChannel: action.payload
            };
        case GET_SELECTED_CHANNEL_USERS:
            return {
                ...state,
                selectedChannelUsers : action.payload
            }
        default:
            return state;
      }
};

export const GetChannelsThunk = () =>{
    return async (dispatch: Dispatch<ChannelActions>)  =>  {

        const data = await api.GetChannels();
        dispatch({type:GET_CHANNELS , payload : data as Channel[]}); 
    }
}

export const GetUsersThunk = (channelId : string) =>{
    return async (dispatch: Dispatch<ChannelActions>)  =>  {

        const data = await api.GetChannelUsers(channelId);
        dispatch(GetChannelUsersActionActionCreator(data as ChannelUser[])); 
    }
}


 export const GetChannelUsersActionActionCreator = (channels: ChannelUser[]): GetSelectedChannelUsersAction => ({
      type: GET_SELECTED_CHANNEL_USERS,
      payload: channels
});



 export const GetChannelsActionActionCreator = (channels: Channel[]): GetChannelsAction => ({
      type: GET_CHANNELS,
      payload: channels
});

export  const SetSelectedChannelActionCreator = ( channel : Channel) : SetSelectedChannelAction => ({
    type: SET_SELECTED_CHANNEL,
    payload: channel
});


export default channelReducer;