import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'
import authReducer from './reducers/auth-reducer'; 
import  channelReducerc  from './reducers/channel-reducer'; 
import { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';


const rootReducer = combineReducers({
    auth: authReducer, 
    channels: channelReducerc,
    
});
export type RootState = ReturnType<typeof rootReducer>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector


const store = createStore(
    rootReducer,
    {},
    applyMiddleware(thunk)
);

export default store;