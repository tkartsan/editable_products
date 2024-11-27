import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

  return useQuery<Item[], Error>({
    queryKey: ['items'], // Query key
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      dispatch(setItems(data.data)); // Sync fetched items with Redux
      return data.data;
    },
    staleTime: 300000, // Cache for 5 minutes
  });
};

export const useAddItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<
    Item, // Return type
    Error, // Error type
    { name: string; price: number } // Variables type
  >({
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
      queryClient.invalidateQueries({ queryKey: ['items'] }); // Proper query invalidation
      dispatch(addItem(newItem)); // Sync added item with Redux
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<
    Item, // Return type
    Error, // Error type
    { id: string; name: string; price: number } // Variables type
  >({
    mutationFn: async ({ id, name, price }) => {
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
      queryClient.invalidateQueries({ queryKey: ['items'] });
      dispatch(updateItem(updatedItem)); // Sync updated item with Redux
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<
    string, // Return type (id of deleted item)
    Error, // Error type
    string // Variables type (id to delete)
  >({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      dispatch(deleteItem(id)); // Sync deleted item with Redux
    },
  });
};
