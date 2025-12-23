import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const { loginUser, toggleTheme, mode } = useContext(AuthContext);
  const navigate = useNavigate();

  // Функция валидации email
  const validateEmail = (email) => {
    if (!email.trim()) return 'Email обязателен для заполнения';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Введите корректный email адрес';
    return '';
  };

  // Функция валидации пароля
  const validatePassword = (password) => {
    if (!password) return 'Пароль обязателен для заполнения';
    if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Валидация в реальном времени
    if (name === 'email') {
      setErrors({ ...errors, email: validateEmail(value) });
    } else if (name === 'password') {
      setErrors({ ...errors, password: validatePassword(value) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверяем валидацию перед отправкой
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      
      if (emailError && passwordError) {
        alert('Пожалуйста, исправьте ошибки в форме');
      } else if (emailError) {
        alert('Пожалуйста, введите корректный email');
      } else {
        alert('Пароль должен содержать минимум 6 символов');
      }
      return;
    }

    // Проверяем тестовые данные с email
    if (form.email === 'admin@carwash.com' && form.password === 'admin123') {
      const userData = { 
        username: 'admin', 
        email: form.email,
        role: 'admin',
        token: 'fake-admin-token'
      };
      loginUser(userData);
      navigate('/admin');
      return;
    }

    if (form.email === 'client@carwash.com' && form.password === 'client123') {
      const userData = { 
        username: 'client', 
        email: form.email,
        role: 'client',
        token: 'fake-client-token'
      };
      loginUser(userData);
      navigate('/client');
      return;
    }

    // Если регистрация (не тестовый пользователь)
    if (!isLogin) {
      // Здесь можно добавить логику регистрации
      const userData = { 
        username: form.email.split('@')[0], // Используем часть email как username
        email: form.email,
        role: 'client',
        token: 'fake-new-user-token'
      };
      loginUser(userData);
      navigate('/client');
      return;
    }

    alert('Неверный email или пароль');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ email: '', password: '' });
    setErrors({ email: '', password: '' });
  };

  // Проверяем, есть ли ошибки валидации
  const hasErrors = errors.email || errors.password;
  const isFormValid = form.email && form.password && !hasErrors;

  return (
    <>
      {/* Переключатель темы */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <Tooltip title={mode === 'light' ? 'Темная тема' : 'Светлая тема'}>
          <IconButton 
            onClick={toggleTheme}
            sx={{ 
              bgcolor: mode === 'light' ? 'primary.main' : 'secondary.main',
              color: 'white',
              '&:hover': { 
                bgcolor: mode === 'light' ? 'primary.dark' : 'secondary.dark'
              }
            }}
          >
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            py: 4,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CarRepairIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                АВТОМОЙКА
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Система управления автомобильной мойкой
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => setErrors({ ...errors, email: validateEmail(form.email) })}
                margin="normal"
                variant="outlined"
                required
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email || "Введите ваш email адрес"}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              
              <TextField
                fullWidth
                label="Пароль"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onBlur={() => setErrors({ ...errors, password: validatePassword(form.password) })}
                margin="normal"
                variant="outlined"
                required
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password || "Минимум 6 символов"}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!isFormValid}
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  py: 1.5,
                  '&:disabled': {
                    backgroundColor: 'grey.300',
                    color: 'grey.500'
                  }
                }}
              >
                {isLogin ? 'Войти в систему' : 'Зарегистрироваться'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  onClick={toggleMode}
                  color="secondary"
                  sx={{ textTransform: 'none' }}
                >
                  {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                </Button>
              </Box>

              {isLogin && (
                <Alert 
                  severity="info" 
                  sx={{ mt: 3 }}
                  icon={false}
                >
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Тестовые данные для входа:
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <AdminPanelSettingsIcon color="primary" sx={{ mb: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Администратор
                          </Typography>
                          <Typography variant="caption" display="block">
                            Email: admin@carwash.com
                          </Typography>
                          <Typography variant="caption" display="block">
                            Пароль: admin123
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <PersonIcon color="secondary" sx={{ mb: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Клиент
                          </Typography>
                          <Typography variant="caption" display="block">
                            Email: client@carwash.com
                          </Typography>
                          <Typography variant="caption" display="block">
                            Пароль: client123
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Alert>
              )}
            </form>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Login;