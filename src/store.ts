import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'

import  channelReducerc  from './reducers/channel-reducer'; 
import { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import { postsReducer } from './reducers/posts-reducer';
import myProfileReducer from './reducers/myProfile-reducer';


const rootReducer = combineReducers({
    channels: channelReducerc,
    posts: postsReducer,
    myProfile : myProfileReducer
});
export type RootState = ReturnType<typeof rootReducer>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector


const store = createStore(
    rootReducer,
    {},
    applyMiddleware(thunk)
);

export default store;