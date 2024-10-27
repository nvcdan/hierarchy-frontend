import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password,
      });
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      onLogin();
      toast.success('Login successful!'); // Toast de succes
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed';
      console.error('Login error:', errorMessage);
      toast.error(`Login failed: ${errorMessage}`); // Toast de eroare
    }
  };

  return (
    <div className="login-container">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <img src="/logoLight.svg" alt="Logo" className="login-logo" width={200} height={200} />
      <h2>Autentificare</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Utilizator:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Parola:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;