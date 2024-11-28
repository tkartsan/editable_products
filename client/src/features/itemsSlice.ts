import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  id: string;
  name: string;
  price: number;
}

const initialState: { items: Item[] } = { items: [] };

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const { setItems, addItem, updateItem, deleteItem } = itemsSlice.actions;
export default itemsSlice.reducer;
