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
  const { useFetchItemsQuery } = useFetchItems();
  const { data: items = [], isLoading, isError } = useFetchItemsQuery();

  const addItemMutation = useAddItem();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateItemMutation.mutate({ id: editingId, name, price: parseFloat(price) });
      setEditingId(null);
    } else {
      addItemMutation.mutate({ name, price: parseFloat(price) });
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
    deleteItemMutation.mutate(id);
  };

  const applyFilter = () => {
    const filtered = items.filter((item) => {
      const itemPrice = item.price;
      const min = minPrice ? parseFloat(minPrice) : null;
      const max = maxPrice ? parseFloat(maxPrice) : null;

      if (min !== null && itemPrice < min) return false;
      if (max !== null && itemPrice > max) return false;
      return true;
    });
    setFilteredItems(filtered);
  };

  const clearFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setFilteredItems(items);
  };

  if (isLoading) return <p className="loading">Loading...</p>;
  if (isError) return <p className="error">Error loading items.</p>;

  return (
    <div className="app-container">
      <h1 className="title">Object Management</h1>
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
        <div className="global-objects-wrapper">
          <h2 className="items-title">Items</h2>
          <div className="filter-wrapper">
            <input
              className="input"
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              className="input"
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button className="filter-button" onClick={applyFilter}>Apply Filter</button>
            <button className="filter-button" onClick={clearFilter}>Clear Filter</button>
          </div>
        </div>
        <table className="items-table">
          <thead>
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Price</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item: Item) => (
              <tr key={item.id} className="table-row">
                <td className="table-cell">{item.name}</td>
                <td className="table-cell">${item.price.toFixed(2)}</td>
                <td className="table-cell action-buttons">
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
