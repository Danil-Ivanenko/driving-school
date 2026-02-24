import { Dispatch } from "redux"
import { Channel } from "../types";
import { api } from "../API/api";



interface GetChannelsAction {
    type: typeof GET_CHANNELS,
    payload: Channel[]
}

interface SetSelectedChannelAction {
    type: typeof SET_SELECTED_CHANNEL,
    payload: string
}

export type ChannelActions = GetChannelsAction | SetSelectedChannelAction;

export const GET_CHANNELS = 'GET_CHANNELS'; 
export const SET_SELECTED_CHANNEL = 'SET_SELECTED_CHANNEL'; 

type ChannelState = {
    channels: Channel[],
    selectedChannelId: string
};

const initialState: ChannelState = {
      channels: [],
      selectedChannelId: ""
};

export const channelReducer = (
      state: ChannelState = initialState,
      action: ChannelActions
): ChannelState => {
      switch (action.type) {

        case GET_CHANNELS:
            return {
            channels : action.payload,
            selectedChannelId :  ""
            };
        case SET_SELECTED_CHANNEL:
            return {
                ...state,
                selectedChannelId: action.payload
            };
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





 export const GetChannelsActionActionCreator = (channels: Channel[]): GetChannelsAction => ({
      type: GET_CHANNELS,
      payload: channels
});

export  const SetSelectedChannelActionCreator = ( channelId : string) : SetSelectedChannelAction => ({
    type: SET_SELECTED_CHANNEL,
    payload: channelId
});


export default channelReducer;