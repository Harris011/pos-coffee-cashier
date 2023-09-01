import { configureStore } from "@reduxjs/toolkit";
import authUser from "./authUser";

export const globalStore = configureStore({
    reducer: {
        authUser
    }
});

export default globalStore;