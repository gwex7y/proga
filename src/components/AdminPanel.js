import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  Alert,
  Divider,
  Snackbar,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Done as DoneIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';

const AdminPanel = () => {
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("clients");
    return saved ? JSON.parse(saved) : [];
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("appointments");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [car, setCar] = useState("");
  const [phone, setPhone] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const { user, logoutUser, toggleTheme, mode } = useContext(AuthContext);

  // Состояния для валидации
  const [errors, setErrors] = useState({
    name: '',
    car: '',
    phone: '',
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Список услуг
  const services = [
    { id: 1, name: 'Экспресс-мойка', price: 500, duration: '20 мин' },
    { id: 2, name: 'Стандартная мойка', price: 800, duration: '30 мин' },
    { id: 3, name: 'Комплексная мойка', price: 1500, duration: '45 мин' },
    { id: 4, name: 'Детейлинг', price: 3000, duration: '2 часа' },
    { id: 5, name: 'Химчистка салона', price: 2000, duration: '1.5 часа' }
  ];

  // Сохраняем изменения
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  // Валидация при изменении полей
  useEffect(() => {
    const nameError = name.trim() === '' ? 'Имя обязательно' : '';
    const carError = car.trim() === '' ? 'Марка автомобиля обязательна' : '';
    const phoneError = phone.trim() === '' ? 'Телефон обязателен' : '';
    
    setErrors({
      name: nameError,
      car: carError,
      phone: phoneError,
    });
  }, [name, car, phone]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Функции для управления клиентами
  const handleDelete = (indexToRemove) => {
    if (window.confirm("Вы уверены, что хотите удалить этого клиента?")) {
      setClients((prevClients) =>
        prevClients.filter((_, index) => index !== indexToRemove)
      );
      if (editIndex === indexToRemove) {
        handleCancelEdit();
      }
      showSnackbar('Клиент успешно удален', 'success');
    }
  };

  const handleEdit = (index) => {
    const client = clients[index];
    setName(client.name);
    setCar(client.car);
    setPhone(client.phone);
    setEditIndex(index);
  };

  const handleAdd = () => {
    // Проверяем валидацию
    if (name.trim() === '' || car.trim() === '' || phone.trim() === '') {
      showSnackbar('Пожалуйста, заполните все поля', 'error');
      return;
    }

    const newClient = { 
      name: name.trim(), 
      car: car.trim(), 
      phone: phone.trim(), 
      visits: 0, 
      totalSpent: 0 
    };

    if (editIndex !== null) {
      const updated = [...clients];
      updated[editIndex] = newClient;
      setClients(updated);
      setEditIndex(null);
      showSnackbar('Клиент успешно обновлен', 'success');
    } else {
      setClients((prevClients) => [...prevClients, newClient]);
      showSnackbar('Клиент успешно добавлен', 'success');
    }

    setName("");
    setCar("");
    setPhone("");
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setName("");
    setCar("");
    setPhone("");
    setErrors({ name: '', car: '', phone: '' });
  };

  // Функции для управления записями
  const handleConfirmAppointment = (index) => {
    setAppointments(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status: 'confirmed',
        confirmedAt: new Date().toLocaleString()
      };
      return updated;
    });
    showSnackbar('Запись подтверждена!', 'success');
  };

  const handleRejectAppointment = (index) => {
    const reason = prompt('Укажите причину отклонения записи:');
    if (reason === null) return; // Пользователь отменил
    
    setAppointments(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status: 'rejected',
        rejectedAt: new Date().toLocaleString(),
        rejectionReason: reason
      };
      return updated;
    });
    showSnackbar('Запись отклонена', 'warning');
  };

  const handleCompleteAppointment = (index) => {
    if (!window.confirm('Вы уверены, что услуга выполнена и автомобиль готов?')) {
      return;
    }
    
    setAppointments(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status: 'completed',
        completedAt: new Date().toLocaleString()
      };
      
      // Обновляем статистику клиента
      const clientName = updated[index].clientName;
      const servicePrice = updated[index].price;
      
      const updatedClients = clients.map(client => {
        if (client.name === clientName) {
          return {
            ...client,
            visits: (client.visits || 0) + 1,
            totalSpent: (client.totalSpent || 0) + servicePrice
          };
        }
        return client;
      });
      
      setClients(updatedClients);
      
      return updated;
    });
    showSnackbar('Услуга отмечена как завершенная! Статистика клиента обновлена.', 'success');
  };

  const handleSave = () => {
    localStorage.setItem("clients", JSON.stringify(clients));
    localStorage.setItem("appointments", JSON.stringify(appointments));
    showSnackbar('Все изменения сохранены!', 'success');
  };

  // Группируем записи по статусу
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const rejectedAppointments = appointments.filter(a => a.status === 'rejected');

  // Проверяем, можно ли добавить клиента (нет ошибок и все поля заполнены)
  const canAddClient = name.trim() && car.trim() && phone.trim() && 
                       !errors.name && !errors.car && !errors.phone;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Шапка */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        bgcolor: 'primary.main', 
        color: 'white',
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCarIcon /> АВТОМОЙКА — Панель администратора
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title={mode === 'light' ? 'Темная тема' : 'Светлая тема'}>
                <IconButton 
                  onClick={toggleTheme}
                  sx={{ 
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
              </Tooltip>
              
              <Chip 
                icon={<PersonIcon />} 
                label={`Админ: ${user?.username}`} 
                sx={{ 
                  color: 'white', 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontWeight: 'medium'
                }}
              />
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={logoutUser}
                startIcon={<LogoutIcon />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Выйти
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Левая колонка - клиенты */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main',
                fontWeight: 'bold'
              }}>
                <PersonIcon /> Управление клиентами
              </Typography>
              
              {/* Форма */}
              <Paper sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: mode === 'light' ? 'grey.50' : 'grey.900',
                borderRadius: 2,
                border: '1px solid',
                borderColor: mode === 'light' ? 'grey.200' : 'grey.700'
              }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  {editIndex !== null ? "Редактировать клиента" : "Добавить нового клиента"}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Имя клиента *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      size="small"
                      variant="outlined"
                      required
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Марка автомобиля *"
                      value={car}
                      onChange={(e) => setCar(e.target.value)}
                      size="small"
                      variant="outlined"
                      required
                      error={!!errors.car}
                      helperText={errors.car}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Телефон *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      size="small"
                      variant="outlined"
                      required
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleAdd}
                        disabled={!canAddClient}
                        startIcon={editIndex !== null ? <SaveIcon /> : <AddIcon />}
                        sx={{ flex: 2 }}
                      >
                        {editIndex !== null ? "Сохранить изменения" : "Добавить клиента"}
                      </Button>
                      {editIndex !== null && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleCancelEdit}
                          startIcon={<CancelIcon />}
                          sx={{ flex: 1 }}
                        >
                          Отмена
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Таблица клиентов */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Всего клиентов: {clients.length}
                </Typography>
              </Box>
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.light' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Имя</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Автомобиль</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Телефон</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography color="text.secondary" sx={{ py: 2 }}>
                            Нет клиентов
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      clients.map((client, index) => (
                        <TableRow 
                          key={index} 
                          hover 
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'action.hover' 
                            } 
                          }}
                        >
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.car}</TableCell>
                          <TableCell>{client.phone}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(index)}
                                sx={{ 
                                  bgcolor: 'primary.50',
                                  '&:hover': { bgcolor: 'primary.100' }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDelete(index)}
                                sx={{ 
                                  bgcolor: 'error.50',
                                  '&:hover': { bgcolor: 'error.100' }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Правая колонка - записи */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main',
                fontWeight: 'bold'
              }}>
                <DirectionsCarIcon /> Записи на услуги
              </Typography>
              
              {/* Статистика */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Card sx={{ 
                    textAlign: 'center', 
                    p: 1, 
                    bgcolor: 'info.light', 
                    color: mode === 'light' ? 'white' : 'black',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6">{appointments.length}</Typography>
                    <Typography variant="caption">Всего</Typography>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card sx={{ 
                    textAlign: 'center', 
                    p: 1, 
                    bgcolor: 'warning.light', 
                    color: mode === 'light' ? 'white' : 'black',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6">{pendingAppointments.length}</Typography>
                    <Typography variant="caption">Ожидают</Typography>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card sx={{ 
                    textAlign: 'center', 
                    p: 1, 
                    bgcolor: 'success.light', 
                    color: mode === 'light' ? 'white' : 'black',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6">{confirmedAppointments.length}</Typography>
                    <Typography variant="caption">Подтверждены</Typography>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card sx={{ 
                    textAlign: 'center', 
                    p: 1, 
                    bgcolor: 'primary.light', 
                    color: mode === 'light' ? 'white' : 'black',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6">{completedAppointments.length}</Typography>
                    <Typography variant="caption">Завершены</Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Секция 1: Новые записи (ожидающие подтверждения) */}
              {pendingAppointments.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom color="warning.main" sx={{ fontWeight: 'bold' }}>
                    ⏳ Новые записи ({pendingAppointments.length})
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto', pr: 1 }}>
                    {pendingAppointments.map((appointment, index) => {
                      const globalIndex = appointments.findIndex(a => a.id === appointment.id);
                      return (
                        <Card 
                          key={appointment.id} 
                          sx={{ 
                            mb: 2, 
                            p: 2, 
                            borderRadius: 2,
                            borderLeft: 4,
                            borderColor: 'warning.main'
                          }}
                        >
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={7}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {appointment.clientName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {appointment.serviceName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                📞 {appointment.clientPhone}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                📅 {appointment.createdAt}
                              </Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => handleConfirmAppointment(globalIndex)}
                                    startIcon={<CheckIcon />}
                                    sx={{ textTransform: 'none' }}
                                  >
                                    Принять
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => handleRejectAppointment(globalIndex)}
                                    startIcon={<CloseIcon />}
                                    sx={{ textTransform: 'none' }}
                                  >
                                    Отклонить
                                  </Button>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Card>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Секция 2: Подтвержденные записи (готовы к выполнению) */}
              {confirmedAppointments.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom color="success.main" sx={{ fontWeight: 'bold' }}>
                    ✅ Подтвержденные записи ({confirmedAppointments.length})
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto', pr: 1 }}>
                    {confirmedAppointments.map((appointment, index) => {
                      const globalIndex = appointments.findIndex(a => a.id === appointment.id);
                      return (
                        <Card 
                          key={appointment.id} 
                          sx={{ 
                            mb: 2, 
                            p: 2, 
                            borderRadius: 2,
                            borderLeft: 4,
                            borderColor: 'success.main'
                          }}
                        >
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={7}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {appointment.clientName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {appointment.serviceName}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip 
                                  label={`${appointment.price} руб.`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip 
                                  label={appointment.duration}
                                  size="small"
                                  color="default"
                                  variant="outlined"
                                />
                              </Box>
                              <Typography variant="caption" color="success.main" display="block" sx={{ mt: 1 }}>
                                ✅ Подтверждено: {appointment.confirmedAt}
                              </Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                <Button
                                  variant="contained"
                                  color="info"
                                  size="small"
                                  onClick={() => handleCompleteAppointment(globalIndex)}
                                  startIcon={<DoneIcon />}
                                  sx={{ 
                                    textTransform: 'none',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  Завершить работу
                                </Button>
                                <Typography variant="caption" color="text.secondary" align="right">
                                  Нажмите, когда автомобиль готов
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Card>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Секция 3: Завершенные записи */}
              {completedAppointments.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom color="info.main" sx={{ fontWeight: 'bold' }}>
                    🏁 Завершенные услуги ({completedAppointments.length})
                  </Typography>
                  <Box sx={{ maxHeight: 150, overflow: 'auto', pr: 1 }}>
                    {completedAppointments.map((appointment) => (
                      <Card 
                        key={appointment.id} 
                        sx={{ 
                          mb: 1, 
                          p: 1.5, 
                          borderRadius: 2,
                          borderLeft: 4,
                          borderColor: 'info.main'
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {appointment.clientName} - {appointment.serviceName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          🏁 Завершено: {appointment.completedAt} • {appointment.price} руб.
                        </Typography>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Если нет записей вообще */}
              {appointments.length === 0 && (
                <Alert severity="info" sx={{ borderRadius: 2, mb: 3 }}>
                  Нет активных записей на услуги
                </Alert>
              )}

              {/* Список услуг */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Доступные услуги:
              </Typography>
              <Grid container spacing={1}>
                {services.map(service => (
                  <Grid item xs={12} key={service.id}>
                    <Card variant="outlined" sx={{ 
                      p: 1, 
                      borderRadius: 2,
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main'
                      }
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">{service.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Chip 
                            label={`${service.price} руб.`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {service.duration}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Кнопка сохранения */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ 
            px: 4, 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: 2
          }}
        >
          Сохранить все изменения
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Всего клиентов: {clients.length} | Всего записей: {appointments.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminPanel;