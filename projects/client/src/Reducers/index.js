import { configureStore } from "@reduxjs/toolkit";
import authUser from "./authUser";
import transaction from "./transaction";

export const globalStore = configureStore({
    reducer: {
        authUser,
        transaction
    }
});

export default globalStore;