// src/components/Login.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Пример: жёстко заданная учётка админа
    if (form.username === 'admin' && form.password === 'admin123') {
      loginUser({ username: 'admin', role: 'admin' });
      navigate('/admin');
    } else {
      alert('Неверные данные');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Вход администратора</h2>
      <input name="username" placeholder="Логин" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
      <button type="submit" className="primary-button">Войти</button>
    </form>
  );
};

export default Login;
