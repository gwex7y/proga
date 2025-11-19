// src/api/auth.js

// Фиктивная проверка логина и пароля 
export const login = async ({ username, password }) => {

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
  

  export const register = async ({ username, password, role }) => {

    return {
      success: true,
      message: 'Регистрация прошла успешно'
    };
  };
  