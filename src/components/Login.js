// src/components/Login.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Администратор
    if (form.username === 'admin' && form.password === 'admin123') {
      const userData = { 
        username: 'admin', 
        role: 'admin',
        token: 'fake-admin-token'
      };
      loginUser(userData);
      navigate('/admin');
      return;
    }

    // Клиент
    if (form.username === 'client' && form.password === 'client123') {
      const userData = { 
        username: 'client', 
        role: 'client',
        token: 'fake-client-token'
      };
      loginUser(userData);
      navigate('/client');
      return;
    }

    // Неверные данные
    alert('Неверный логин или пароль');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ username: '', password: '' });
  };

  return (
    <div className="App">
      <h1 className="header-title">АВТОМОЙКА</h1>
      <p className="header-subtitle">Система управления клиентами</p>
      
      <form onSubmit={handleSubmit} className="form-container">
        <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>
        
        <div className="form-group">
          <input 
            name="username" 
            placeholder="Логин" 
            value={form.username}
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <input 
            name="password" 
            type="password" 
            placeholder="Пароль" 
            value={form.password}
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit" className="primary-button" style={{width: '100%'}}>
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={toggleMode}
            style={{background: 'transparent', border: 'none', color: '#667eea', cursor: 'pointer'}}
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>

        {isLogin && (
          <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '13px', color: '#666' }}>
            <strong>Тестовые данные для входа:</strong><br />
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
              <div>
                <strong>Администратор:</strong><br />
                Логин: admin<br />
                Пароль: admin123
              </div>
              <div>
                <strong>Клиент:</strong><br />
                Логин: client<br />
                Пароль: client123
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;