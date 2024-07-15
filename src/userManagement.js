import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

const fetchUsers = async () => {
  const response = await fetch("http://localhost:5000/api/users");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const addUser = async (userName) => {
  const response = await fetch("http://localhost:5000/api/addUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const UserManagement = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery("users", fetchUsers);
  const mutation = useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  const [formData, setFormData] = useState({ userName: "" });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(formData.userName);
    setFormData({ userName: "" });
  };

  const renderTable = () => {
    if (isLoading) {
      return <p className="loading">Loading...</p>;
    }

    if (error) {
      return <p className="error">Error fetching users</p>;
    }

    if (data.users.length === 0) {
      return <p className="no-data">No users available</p>;
    }

    const rows = [];
    for (let i = 0; i < data.users.length; i += 5) {
      rows.push(data.users.slice(i, i + 5));
    }

    return (
      <table className="user-table">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((user, userIndex) => (
                <td key={userIndex}>{user}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="app">
      <header className="header">Add User</header>
      <form className="user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Enter user name"
          required
        />
        <button type="submit">Add User</button>
      </form>
      <div className="container">{renderTable()}</div>
    </div>
  );
};

export default UserManagement;
