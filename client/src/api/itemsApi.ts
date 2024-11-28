import { useQuery, useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setItems, addItem, updateItem, deleteItem } from '../features/itemsSlice';

const API_URL = 'http://localhost:3000/api/items';

interface Item {
  id: string;
  name: string;
  price: number;
}

export const useFetchItems = () => {
  const dispatch = useDispatch();

  const useFetchItemsQuery = () => useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const { data } = await response.json();
      dispatch(setItems(data)); 
      return data;
    },
  });

  return { useFetchItemsQuery };
};

export const useAddItem = () => {
  const dispatch = useDispatch();

  const addItemMutation = useMutation<Item, Error, { name: string; price: number }>({
    mutationFn: async (newItem) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
      const data: { data: Item } = await response.json();
      return data.data;
    },
    onSuccess: (newItem) => {
      dispatch(addItem(newItem)); 
    },
  });

  return addItemMutation;
};

export const useUpdateItem = () => {
  const dispatch = useDispatch();

  const updateItemMutation = useMutation<Item, Error, { id: string; name: string; price: number }>({
    mutationFn: async (updateData) => {
      const { id, name, price } = updateData;
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price }),
      });
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      const data: { data: Item[] } = await response.json();
      return data.data[0];
    },
    onSuccess: (updatedItem) => {
      dispatch(updateItem(updatedItem)); 
    },
  });

  return updateItemMutation;
};

export const useDeleteItem = () => {
  const dispatch = useDispatch();

  const deleteItemMutation = useMutation<string, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      return id;
    },
    onSuccess: (id) => {
      dispatch(deleteItem(id)); 
    },
  });

  return deleteItemMutation;
};
