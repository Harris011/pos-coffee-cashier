import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        transactions: []
    },
    reducers: {
        addItem: (state, action) => {
            state.transactions.push({
                id: action.payload.id,
                name: action.payload.name,
                image: action.payload.image,
                stock: action.payload.stock,
                price: action.payload.price,
                quantity: 1,
            });
        },
        removeItem: (state, action) => {
            const indexToRemove = state.transactions.findIndex(
                (item) => item.id === action.payload.id
            );
            
            if (indexToRemove !== -1) {
                state.transactions.splice(indexToRemove, 1);
            }
        },
        updateQuantity: (state, action) => {
            const {id, quantity} = action.payload;
            const itemToUpdate = state.transactions.find(item => item.id === id);
            if (itemToUpdate) {
                itemToUpdate.quantity = quantity
            }
        }
    }
});

export const {addItem, removeItem, updateQuantity} = transactionSlice.actions;
export default transactionSlice.reducer;