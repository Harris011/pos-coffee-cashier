import { createSlice } from "@reduxjs/toolkit";

const authUserSlice = createSlice({
    name: 'authUser',
    initialState: {
        email: '',
        username: '',
        role_id: '',
        role: ''
    },
    reducers: {
        loginAction: (state, action) => {
            state.email= action.payload.email;
            state.username= action.payload.username;
            state.role_id= action.payload.role_id;
            state.role= action.payload.role;
        },
        logoutAction: (state) => {
            state.email= '';
            state.username= '';
            state.role_id= '';
            state.role='';
        }
    }
});

export const {loginAction, logoutAction} = authUserSlice.actions;
export default authUserSlice.reducer;