import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import './App.css';

const fetchProducts = async () => {
  const response = await fetch("http://localhost:5000/products");
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const addProduct = async (product) => {
  const response = await fetch("http://localhost:5000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const updateProduct = async (product) => {
  const response = await fetch(`http://localhost:5000/products/${product.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const deleteProduct = async (id) => {
  const response = await fetch(`http://localhost:5000/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const LeaveApplication = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ id: '', name: '', price: '', quantity: '', active: true });
  const [editing, setEditing] = useState(false);

  const { data, error, isLoading } = useQuery('products', fetchProducts);

  const addMutation = useMutation(newProduct => addProduct(newProduct), {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });

  const updateMutation = useMutation(updatedProduct => updateProduct(updatedProduct), {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });

  const deleteMutation = useMutation(productId => deleteProduct(productId), {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editing) {
      updateMutation.mutate(formData);
      setEditing(false);
    } else {
      addMutation.mutate(formData);
    }
    setFormData({ id: '', name: '', price: '', quantity: '', active: true });
  };

  const handleEdit = (product) => {
    setFormData({ id: product.id, name: product.name, price: product.price, quantity: product.quantity, active: product.active });
    setEditing(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const renderTable = () => {
    if (isLoading) {
      return <p className="loading">Loading...</p>;
    }

    if (error) {
      return <p className="error">Error fetching products: {error.message}</p>;
    }

    if (!data || data.length === 0) {
      return <p className="no-data">No products available</p>;
    }

    return (
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.active ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(product)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="app">
      <header className="header">Leave Application</header>
      <form className="user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter product price"
          required
        />
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter product quantity"
          required
        />
        <input
          type="checkbox"
          name="active"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
        />
        <label htmlFor="active">Active</label>
        <button type="submit">{editing ? 'Update Product' : 'Add Product'}</button>
      </form>
      <div className="container">
        {renderTable()}
      </div>
    </div>
  );
};

export default LeaveApplication;
