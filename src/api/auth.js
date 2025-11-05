// src/api/auth.js

// Фиктивная проверка логина и пароля (можно заменить на fetch-запрос к серверу)
export const login = async ({ username, password }) => {
    // Пример: жёстко заданная учётка админа
    if (username === 'admin' && password === 'admin123') {
      return {
        success: true,
        token: 'fake-admin-token',
        username: 'admin',
        role: 'admin'
      };
    }
  
    // Пример: учётка клиента (можно добавить позже)
    if (username === 'client' && password === 'client123') {
      return {
        success: true,
        token: 'fake-client-token',
        username: 'client',
        role: 'client'
      };
    }
  
    // Неверные данные
    return {
      success: false,
      message: 'Неверный логин или пароль'
    };
  };
  
  // Заготовка для регистрации (можно подключить позже)
  export const register = async ({ username, password, role }) => {
    // Здесь можно реализовать POST-запрос на сервер
    return {
      success: true,
      message: 'Регистрация прошла успешно'
    };
  };
  