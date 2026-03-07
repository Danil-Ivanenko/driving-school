import { api } from "../API/api";
import { UserProfile } from "../types";
import { Dispatch } from "redux"

export const GET_MY_PROFILE = 'GET_MY_PROFILE'; 
interface GetMyProfile {
    type: typeof GET_MY_PROFILE,
    payload: UserProfile
}

export type ProfileActions = GetMyProfile;

type MyProfileState = {
    profile: UserProfile | null
};

const initialState: MyProfileState = {
    profile: null
};

export const myProfileReducer = (
      state: MyProfileState = initialState,
      action: ProfileActions
): MyProfileState => {
      switch (action.type) {

        case GET_MY_PROFILE:
            return {
            ...state,
            profile : action.payload
            };

        default:
            return state;
      }
};


 export const GetMyProfileActionCreator = (profile:UserProfile): GetMyProfile => ({
      type: GET_MY_PROFILE,
      payload: profile
});

export const GetMyProfileThunk = () =>{
    return async (dispatch: Dispatch<ProfileActions>)  =>  {

        const data = await api.GetMyProfile();
        dispatch(GetMyProfileActionCreator(data as UserProfile)); 
    }
}
export default myProfileReducer;