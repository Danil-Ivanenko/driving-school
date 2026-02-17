import { Dispatch } from "redux"

interface UserLoginState {
    email: string,
    password: string
}

export type AuthState = {
    user: UserLoginState,
    error: string
};


interface LoginRequestAction {
    type: typeof LOGIN_REQUEST,
    payload: UserLoginState
}

interface LoginFailureAction {
    type: typeof LOGIN_FAILURE,
    error: string
}

export type AuthActions = LoginRequestAction | LoginFailureAction;

export const LOGIN_REQUEST = 'LOGIN_REQUEST'; 
export const LOGIN_FAILURE = 'LOGIN_FAILURE'; 


const initialState: AuthState = {
      user: {
          email: '',
          password: ''
      },
      error: ""
};

export const authReducer = (
      state: AuthState = initialState,
      action: AuthActions
): AuthState => {
      switch (action.type) {
          case LOGIN_REQUEST:
              return {
                  user: {
                      email: action.payload.email,
                      password: action.payload.password
                  },
                  error: ""
              };
          case LOGIN_FAILURE:
              return {
                  ...state,
                  error: action.error ?? ""
              };
          default:
              return state;
      }
};

export const testFetch = () => {
    return async (dispatch: Dispatch<AuthActions>) => 
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        dispatch( {type: LOGIN_FAILURE, error: "test"});
    }
}



// export const loginActionCreator = (user: UserLoginState): LoginRequestAction => ({
//       type: LOGIN_REQUEST,
//       payload: user
// });

// export const loginFailureActionCreator = ( error : string) : LoginFailureAction => ({
//     type: LOGIN_FAILURE,
//     error: error
// });


export default authReducer;