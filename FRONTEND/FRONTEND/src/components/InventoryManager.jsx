import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import config from './config.js';

const InventoryManager = () => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({
    id: '',
    name: '',
    category: '',
    stock: '',
    price: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedItem, setFetchedItem] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${config.url}/inventoryapi`;

  const itemKeys = ['id', 'name', 'category', 'stock', 'price'];

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setItems(res.data);
    } catch (error) {
      setMessage('Failed to fetch inventory items.');
    }
  };

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key of itemKeys) {
      if (!item[key] || item[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addItem = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, item);
      setMessage('Item added successfully.');
      fetchAllItems();
      resetForm();
    } catch (error) {
      setMessage('Error adding item.');
    }
  };

  const updateItem = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, item);
      setMessage('Item updated successfully.');
      fetchAllItems();
      resetForm();
    } catch (error) {
      setMessage('Error updating item.');
    }
  };

  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllItems();
    } catch (error) {
      setMessage('Error deleting item.');
    }
  };

  const getItemById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedItem(res.data);
      setMessage('');
    } catch (error) {
      setFetchedItem(null);
      setMessage('Item not found.');
    }
  };

  const handleEdit = (itm) => {
    setItem(itm);
    setEditMode(true);
    setMessage(`Editing item with ID ${itm.id}`);
  };

  const resetForm = () => {
    setItem({
      id: '',
      name: '',
      category: '',
      stock: '',
      price: ''
    });
    setEditMode(false);
  };

  return (
    <div className="inventory-container" style={{ padding: '20px' }}>

      {message && (
        <div style={{ marginBottom: '10px', color: message.toLowerCase().includes('error') ? 'red' : 'green' }}>
          {message}
        </div>
      )}

      <h2>Inventory Management</h2>

      {/* Add / Edit Form */}
      <div style={{ marginBottom: '20px' }}>
        <h3>{editMode ? 'Edit Item' : 'Add Item'}</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="number" name="id" placeholder="ID" value={item.id} onChange={handleChange} />
          <input type="text" name="name" placeholder="Name" value={item.name} onChange={handleChange} />
          <input type="text" name="category" placeholder="Category" value={item.category} onChange={handleChange} />
          <input type="number" name="stock" placeholder="Stock" value={item.stock} onChange={handleChange} />
          <input type="number" name="price" placeholder="Price" value={item.price} onChange={handleChange} />
        </div>
        <div style={{ marginTop: '10px' }}>
          {!editMode ? (
            <button onClick={addItem} style={{ marginRight: '10px' }}>Add Item</button>
          ) : (
            <>
              <button onClick={updateItem} style={{ marginRight: '10px' }}>Update Item</button>
              <button onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      {/* Fetch By ID */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Get Item By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
          style={{ marginRight: '10px' }}
        />
        <button onClick={getItemById}>Fetch</button>

        {fetchedItem && (
          <div style={{ marginTop: '10px' }}>
            <pre>{JSON.stringify(fetchedItem, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* All Items Table */}
      <div>
        <h3>All Inventory Items</h3>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                {itemKeys.map((key) => <th key={key}>{key}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((itm) => (
                <tr key={itm.id}>
                  {itemKeys.map((key) => <td key={key}>{itm[key]}</td>)}
                  <td>
                    <button onClick={() => handleEdit(itm)} style={{ marginRight: '5px' }}>Edit</button>
                    <button onClick={() => deleteItem(itm.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default InventoryManager;
