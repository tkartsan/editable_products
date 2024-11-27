// src/features/localItemsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
    id: string;
    name: string;
    price: number;
}

interface ItemsState {
    items: Item[];
}

const initialState: ItemsState = {
    items: [],
};

const localItemsSlice = createSlice({
    name: 'localItems',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<Item[]>) => {
            state.items = action.payload;
        },
        addItem: (state, action: PayloadAction<Item>) => {
            state.items.push(action.payload);
        },
        updateItem: (state, action: PayloadAction<Item>) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { setItems, addItem, updateItem, deleteItem } = localItemsSlice.actions;

export default localItemsSlice.reducer;
