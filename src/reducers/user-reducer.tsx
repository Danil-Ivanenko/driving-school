import { Dispatch } from 'redux';
import { api } from '../API/api';
import { FullInfo, UserRole } from '../types';

const SET_USERS = 'SET_USERS';
const ADD_USER = 'ADD_USER';
const UPDATE_USER_IN_STORE = 'UPDATE_USER';
const REMOVE_USER = 'REMOVE_USER';
const SET_SELECTED_USER = 'SET_SELECTED_USER';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

interface UserState {
    users: FullInfo[];
    selectedUser: FullInfo | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null
};

export const userReducer = (state = initialState, action: any): UserState => {
    switch (action.type) {
        case SET_USERS:
            return { ...state, users: action.payload };
        case ADD_USER:
            return { ...state, users: [...state.users, action.payload] };
        case UPDATE_USER_IN_STORE:
            return {
                ...state,
                users: state.users.map(user => 
                    user.id === action.payload.id ? action.payload : user
                )
            };
        case REMOVE_USER:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload)
            };
        case SET_SELECTED_USER:
            return { ...state, selectedUser: action.payload };
        case SET_LOADING:
            return { ...state, loading: action.payload };
        case SET_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export const setUsers = (users: FullInfo[]) => ({ type: SET_USERS, payload: users });
export const addUser = (user: FullInfo) => ({ type: ADD_USER, payload: user });
export const updateUserInStore = (user: FullInfo) => ({ type: UPDATE_USER_IN_STORE, payload: user });
export const removeUser = (id: number) => ({ type: REMOVE_USER, payload: id });
export const setSelectedUser = (user: FullInfo | null) => ({ type: SET_SELECTED_USER, payload: user });
export const setLoading = (loading: boolean) => ({ type: SET_LOADING, payload: loading });
export const setError = (error: string | null) => ({ type: SET_ERROR, payload: error });

export const GetAllUsersThunk = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoading(true));
        const users = await api.getAllUsers();
        dispatch(setUsers(users));
        dispatch(setError(null));
    } catch (error: any) {
        dispatch(setError(error.response?.data?.message || 'Failed to fetch users'));
        console.error('GetAllUsersThunk error:', error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const GetUserByIdThunk = (id: number) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoading(true));
        const user = await api.getUserById(id);
        dispatch(setSelectedUser(user));
        dispatch(setError(null));
    } catch (error: any) {
        dispatch(setError(error.response?.data?.message || 'Failed to fetch user'));
        console.error('GetUserByIdThunk error:', error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const CreateUserThunk = (userData: any) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoading(true));
        const newUser = await api.createUser(userData);
        dispatch(addUser(newUser));
        dispatch(setError(null));
        return newUser;
    } catch (error: any) {
        dispatch(setError(error.response?.data?.message || 'Failed to create user'));
        console.error('CreateUserThunk error:', error);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

export const UpdateUserThunk = (id: number, userData: any) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoading(true));
        const updatedUser = await api.updateUser(id, userData);
        dispatch(updateUserInStore(updatedUser));
        dispatch(setError(null));
        return updatedUser;
    } catch (error: any) {
        dispatch(setError(error.response?.data?.message || 'Failed to update user'));
        console.error('UpdateUserThunk error:', error);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

export const DeleteUserThunk = (id: number) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoading(true));
        await api.deleteUser(id);
        dispatch(removeUser(id));
        dispatch(setError(null));
    } catch (error: any) {
        dispatch(setError(error.response?.data?.message || 'Failed to delete user'));
        console.error('DeleteUserThunk error:', error);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

export const AddRoleToUserThunk = (id: number, role: UserRole) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoading(true));
        const updatedUser = await api.addRoleToUser(id, role);
        dispatch(updateUserInStore(updatedUser));
        dispatch(setError(null));
    } catch (error: any) {
        dispatch(setError(error.response?.data?.message || 'Failed to add role'));
        console.error('AddRoleToUserThunk error:', error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const RemoveRoleFromUserThunk = (id: number, role: UserRole) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoading(true));
        const updatedUser = await api.removeRoleFromUser(id, role);
        dispatch(updateUserInStore(updatedUser));
        dispatch(setError(null));
    } catch (error: any) {
        dispatch(setError(error.response?.data?.message || 'Failed to remove role'));
        console.error('RemoveRoleFromUserThunk error:', error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const DeactivateUserThunk = (id: number) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoading(true));
        const updatedUser = await api.deactivateUser(id);
        dispatch(updateUserInStore(updatedUser));
        dispatch(setError(null));
    } catch (error: any) {
        dispatch(setError(error.response?.data?.message || 'Failed to deactivate user'));
        console.error('DeactivateUserThunk error:', error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const ActivateUserThunk = (id: number) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoading(true));
        const updatedUser = await api.activateUser(id);
        dispatch(updateUserInStore(updatedUser));
        dispatch(setError(null));
    } catch (error: any) {
        dispatch(setError(error.response?.data?.message || 'Failed to activate user'));
        console.error('ActivateUserThunk error:', error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const SearchUsersThunk = (params: any) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoading(true));
        const users = await api.searchUsers(params);
        dispatch(setUsers(users));
        dispatch(setError(null));
    } catch (error: any) {
        dispatch(setError(error.response?.data?.message || 'Failed to search users'));
        console.error('SearchUsersThunk error:', error);
    } finally {
        dispatch(setLoading(false));
    }
};