// src/components/ClientPage.js
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ClientPage.css';

const ClientPage = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [clientData, setClientData] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');

  // Загрузка данных клиента и услуг
  useEffect(() => {
    // Имитация загрузки данных клиента
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const currentClient = clients.find(client => 
      client.name.toLowerCase().includes(user?.username.toLowerCase()) ||
      client.phone.includes('client')
    );

    setClientData(currentClient || {
      name: user?.username || 'Клиент',
      car: 'Не указан',
      phone: 'Не указан',
      visits: 5,
      totalSpent: 12500
    });

    // Список услуг
    setServices([
      { id: 1, name: 'Экспресс-мойка', price: 500, duration: '20 мин' },
      { id: 2, name: 'Стандартная мойка', price: 800, duration: '30 мин' },
      { id: 3, name: 'Комплексная мойка', price: 1500, duration: '45 мин' },
      { id: 4, name: 'Детейлинг', price: 3000, duration: '2 часа' },
      { id: 5, name: 'Химчистка салона', price: 2000, duration: '1.5 часа' }
    ]);
  }, [user]);

  const handleServiceSelect = (service) => {
    setSelectedService(service.name);
    alert(`Вы выбрали услугу: ${service.name}\nСтоимость: ${service.price} руб.\nПродолжительность: ${service.duration}`);
  };

  const handleBookService = () => {
    if (!selectedService) {
      alert('Пожалуйста, выберите услугу');
      return;
    }
    alert(`Услуга "${selectedService}" забронирована! Мы свяжемся с вами для подтверждения.`);
    setSelectedService('');
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="header-title">АВТОМОЙКА — Личный кабинет</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: 'white', fontSize: '16px' }}>Клиент: {user?.username}</span>
          <button className="primary-button" onClick={logoutUser}>Выйти</button>
        </div>
      </div>

      <div className="client-dashboard">
        {/* Информация о клиенте */}
        <div className="info-card">
          <h3>👤 Мои данные</h3>
          {clientData ? (
            <div className="client-info">
              <p><strong>Имя:</strong> {clientData.name}</p>
              <p><strong>Автомобиль:</strong> {clientData.car}</p>
              <p><strong>Телефон:</strong> {clientData.phone}</p>
              <p><strong>Количество посещений:</strong> {clientData.visits}</p>
              <p><strong>Всего потрачено:</strong> {clientData.totalSpent} руб.</p>
            </div>
          ) : (
            <p>Загрузка данных...</p>
          )}
        </div>

        {/* Бронирование услуг */}
        <div className="services-card">
          <h3>🚗 Запись на услуги</h3>
          <div className="services-list">
            {services.map(service => (
              <div 
                key={service.id} 
                className={`service-item ${selectedService === service.name ? 'selected' : ''}`}
                onClick={() => handleServiceSelect(service)}
              >
                <div className="service-name">{service.name}</div>
                <div className="service-price">{service.price} руб.</div>
                <div className="service-duration">{service.duration}</div>
              </div>
            ))}
          </div>
          <button 
            className="primary-button" 
            onClick={handleBookService}
            style={{width: '100%', marginTop: '20px'}}
            disabled={!selectedService}
          >
            📅 Забронировать выбранную услугу
          </button>
        </div>

        {/* История посещений */}
        <div className="history-card">
          <h3>📊 История посещений</h3>
          <div className="visit-history">
            <div className="visit-item">
              <span>25.12.2024</span>
              <span>Комплексная мойка</span>
              <span>1500 руб.</span>
            </div>
            <div className="visit-item">
              <span>18.12.2024</span>
              <span>Стандартная мойка</span>
              <span>800 руб.</span>
            </div>
            <div className="visit-item">
              <span>10.12.2024</span>
              <span>Экспресс-мойка</span>
              <span>500 руб.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;