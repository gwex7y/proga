// src/components/PrivateRoute.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  
  // Пока проверяем авторизацию, ничего не показываем
  if (loading) {
    return (
      <div className="App">
        <div style={{color: 'white', fontSize: '18px'}}>Загрузка...</div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

export default PrivateRoute;