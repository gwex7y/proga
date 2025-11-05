// src/components/AdminPage.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminPage = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="table-container">
      <h2>Добро пожаловать, админ {user.username}!</h2>
      <button className="primary-button" onClick={logoutUser}>Выйти</button>
    </div>
  );
};

export default AdminPage;
