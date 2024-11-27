import React, { useState } from 'react';
import {
  useFetchItems,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from './api/itemsApi';
import './App.css';

interface Item {
  id: string;
  name: string;
  price: number;
}

const App: React.FC = () => {
  const { data: items = [], isLoading, isError } = useFetchItems();
  const addItem = useAddItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateItem.mutate({ id: editingId, name, price: parseFloat(price) });
      setEditingId(null);
    } else {
      addItem.mutate({ name, price: parseFloat(price) });
    }
    setName('');
    setPrice('');
  };

  const handleEdit = (id: string, currentName: string, currentPrice: number) => {
    setEditingId(id);
    setName(currentName);
    setPrice(currentPrice.toString());
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  if (isLoading) return <p className="loading">Loading...</p>;
  if (isError) return <p className="error">Error loading items.</p>;

  return (
    <div className="app-container">
      <h1>Object Management</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button className="submit-button" type="submit">
          {editingId ? 'Update' : 'Add'} Item
        </button>
      </form>
      <div className="items-container">
        <h2 className="items-title">Items</h2>
        <table className="items-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: Item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(item.id, item.name, item.price)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
