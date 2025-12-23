import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
  Container,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Logout as LogoutIcon,
  CalendarMonth as CalendarMonthIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Done as DoneIcon,
  Close as CloseIcon,
  LocalCarWash as CarWashIcon,
  CarRepair as CarRepairIcon,
  CleanHands as CleanHandsIcon,
  Wash as WashIcon,
  Spa as SpaIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';

const ClientPage = () => {
  const { user, logoutUser, toggleTheme, mode } = useContext(AuthContext);
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [clientAppointments, setClientAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Загружаем клиентов из localStorage
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // Находим текущего клиента
      const currentClient = clients.find(client => 
        client.name.toLowerCase().includes(user?.username.toLowerCase()) ||
        client.phone.includes(user?.username)
      );

      // Если клиента нет в базе, создаем его
      let clientInfo;
      if (!currentClient) {
        clientInfo = {
          name: user?.username || 'Клиент',
          car: 'Не указан',
          phone: 'Не указан',
          visits: 0,
          totalSpent: 0
        };
        // Добавляем нового клиента в базу
        const updatedClients = [...clients, clientInfo];
        localStorage.setItem('clients', JSON.stringify(updatedClients));
      } else {
        clientInfo = currentClient;
      }

      setClientData(clientInfo);

      // Загружаем услуги (те же, что и у админа)
      setServices([
        { 
          id: 1, 
          name: 'Экспресс-мойка', 
          price: 500, 
          duration: '20 мин',
          icon: <CarWashIcon />,
          color: '#1976d2',
          description: 'Быстрая наружная мойка автомобиля'
        },
        { 
          id: 2, 
          name: 'Стандартная мойка', 
          price: 800, 
          duration: '30 мин',
          icon: <WashIcon />,
          color: '#2e7d32',
          description: 'Полная мойка кузова и колес'
        },
        { 
          id: 3, 
          name: 'Комплексная мойка', 
          price: 1500, 
          duration: '45 мин',
          icon: <CarRepairIcon />,
          color: '#ed6c02',
          description: 'Мойка, чистка салона и обработка пластика'
        },
        { 
          id: 4, 
          name: 'Детейлинг', 
          price: 3000, 
          duration: '2 часа',
          icon: <SpaIcon />,
          color: '#9c27b0',
          description: 'Полная профессиональная обработка автомобиля'
        },
        { 
          id: 5, 
          name: 'Химчистка салона', 
          price: 2000, 
          duration: '1.5 часа',
          icon: <CleanHandsIcon />,
          color: '#d32f2f',
          description: 'Глубокая чистка салона и обивки'
        }
      ]);

      // Загружаем записи текущего клиента
      const userAppointments = appointments.filter(appointment => 
        appointment.clientName.toLowerCase().includes(user?.username.toLowerCase())
      );
      setClientAppointments(userAppointments);
      setLoading(false);
    };

    loadData();
  }, [user]);

  const handleServiceSelect = (service) => {
    setSelectedService(service.name);
  };

  const handleBookService = () => {
    if (!selectedService) {
      alert('Пожалуйста, выберите услугу');
      return;
    }

    const selectedServiceData = services.find(s => s.name === selectedService);
    
    // Создаем новую запись
    const newAppointment = {
      id: Date.now(),
      clientName: clientData?.name || user?.username,
      clientPhone: clientData?.phone || 'Не указан',
      clientCar: clientData?.car || 'Не указан',
      serviceName: selectedServiceData.name,
      price: selectedServiceData.price,
      duration: selectedServiceData.duration,
      createdAt: new Date().toLocaleString(),
      status: 'pending',
      notes: ''
    };

    // Получаем текущие записи из localStorage
    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = [...existingAppointments, newAppointment];
    
    // Сохраняем в localStorage
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Обновляем состояние
    setClientAppointments([...clientAppointments, newAppointment]);
    setOpenDialog(true);
    setSelectedService('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    if (window.confirm("Вы уверены, что хотите выйти?")) {
      logoutUser();
      navigate('/login');
    }
  };

  // Статистика по записям клиента
  const pendingCount = clientAppointments.filter(a => a.status === 'pending').length;
  const confirmedCount = clientAppointments.filter(a => a.status === 'confirmed').length;
  const completedCount = clientAppointments.filter(a => a.status === 'completed').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Шапка */}
      <Paper sx={{ 
        p: 3, 
        mb: 4, 
        bgcolor: 'primary.main', 
        color: 'white',
        borderRadius: 3,
        boxShadow: 3
      }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
              <DirectionsCarIcon fontSize="large" />
              АВТОМОЙКА — Личный кабинет
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
                label={`Клиент: ${user?.username}`} 
                sx={{ 
                  color: 'white', 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontWeight: 'medium',
                  fontSize: '1rem'
                }}
              />
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleLogout}
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

      {/* Основной контент */}
      <Grid container spacing={3}>
        {/* Левая колонка - информация о клиенте */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main',
                fontWeight: 'bold'
              }}>
                <PersonIcon /> Мои данные
              </Typography>
              
              {clientData && (
                <Box sx={{ mt: 2 }}>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Имя" 
                        secondary={clientData.name}
                        secondaryTypographyProps={{ sx: { fontWeight: 'medium' } }}
                      />
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.light' }}>
                          <DirectionsCarIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Автомобиль" 
                        secondary={clientData.car}
                        secondaryTypographyProps={{ sx: { fontWeight: 'medium' } }}
                      />
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'info.light' }}>
                          <PhoneIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Телефон" 
                        secondary={clientData.phone}
                        secondaryTypographyProps={{ sx: { fontWeight: 'medium' } }}
                      />
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.light' }}>
                          <AccessTimeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Количество посещений" 
                        secondary={
                          <Chip 
                            label={clientData.visits || 0} 
                            color="primary"
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.light' }}>
                          <Typography sx={{ fontWeight: 'bold' }}>₽</Typography>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Всего потрачено" 
                        secondary={
                          <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                            {clientData.totalSpent || 0} руб.
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Центральная колонка - записи и услуги */}
        <Grid item xs={12} md={8}>
          {/* Статистика записей */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main',
                fontWeight: 'bold'
              }}>
                <CalendarMonthIcon /> Мои записи
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Card sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    bgcolor: 'warning.light', 
                    color: mode === 'light' ? 'white' : 'black',
                    borderRadius: 2
                  }}>
                    <Badge badgeContent={pendingCount} color="warning" max={99}>
                      <PendingIcon sx={{ fontSize: 40 }} />
                    </Badge>
                    <Typography variant="h6" sx={{ mt: 1 }}>{pendingCount}</Typography>
                    <Typography variant="body2">Ожидают</Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    bgcolor: 'success.light', 
                    color: mode === 'light' ? 'white' : 'black',
                    borderRadius: 2
                  }}>
                    <Badge badgeContent={confirmedCount} color="success" max={99}>
                      <CheckCircleIcon sx={{ fontSize: 40 }} />
                    </Badge>
                    <Typography variant="h6" sx={{ mt: 1 }}>{confirmedCount}</Typography>
                    <Typography variant="body2">Подтверждены</Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    bgcolor: 'info.light', 
                    color: mode === 'light' ? 'white' : 'black',
                    borderRadius: 2
                  }}>
                    <Badge badgeContent={completedCount} color="info" max={99}>
                      <DoneIcon sx={{ fontSize: 40 }} />
                    </Badge>
                    <Typography variant="h6" sx={{ mt: 1 }}>{completedCount}</Typography>
                    <Typography variant="body2">Завершены</Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Список записей */}
              {clientAppointments.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  У вас пока нет записей на услуги
                </Alert>
              ) : (
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {clientAppointments.map((appointment) => (
                    <Card 
                      key={appointment.id} 
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        borderRadius: 2,
                        borderLeft: 4,
                        borderColor: 
                          appointment.status === 'pending' ? 'warning.main' :
                          appointment.status === 'confirmed' ? 'success.main' :
                          appointment.status === 'completed' ? 'info.main' : 'error.main'
                      }}
                    >
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={8}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {appointment.serviceName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
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
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            📅 {appointment.createdAt}
                          </Typography>
                          {appointment.confirmedAt && (
                            <Typography variant="caption" color="success.main" display="block">
                              ✅ Подтверждено: {appointment.confirmedAt}
                            </Typography>
                          )}
                          {appointment.completedAt && (
                            <Typography variant="caption" color="info.main" display="block">
                              🏁 Завершено: {appointment.completedAt}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                          <Chip 
                            label={
                              appointment.status === 'pending' ? 'Ожидает' :
                              appointment.status === 'confirmed' ? 'Подтверждено' :
                              appointment.status === 'completed' ? 'Завершено' : 'Отклонено'
                            }
                            color={
                              appointment.status === 'pending' ? 'warning' :
                              appointment.status === 'confirmed' ? 'success' :
                              appointment.status === 'completed' ? 'info' : 'error'
                            }
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Услуги */}
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main',
                fontWeight: 'bold'
              }}>
                <CarWashIcon /> Запись на услуги
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Выберите услугу и нажмите "Забронировать"
              </Typography>

              {/* Список услуг */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {services.map(service => (
                  <Grid item xs={12} key={service.id}>
                    <Card 
                      variant="outlined"
                      onClick={() => handleServiceSelect(service)}
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        cursor: 'pointer',
                        borderColor: selectedService === service.name ? service.color : 'divider',
                        borderWidth: selectedService === service.name ? 2 : 1,
                        bgcolor: selectedService === service.name ? 
                          (mode === 'light' ? `${service.color}10` : `${service.color}20`) : 
                          'background.paper',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                          borderColor: service.color,
                        }
                      }}
                    >
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <Avatar sx={{ bgcolor: service.color }}>
                            {service.icon}
                          </Avatar>
                        </Grid>
                        <Grid item xs>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {service.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {service.description}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" color="success.main" fontWeight="bold">
                            {service.price} ₽
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {service.duration}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Выбранная услуга */}
              {selectedService && (
                <Alert 
                  severity="info" 
                  sx={{ mt: 3, borderRadius: 2 }}
                  icon={false}
                >
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Выбрана услуга: {selectedService}
                  </Typography>
                  <Typography variant="body2">
                    Стоимость: {services.find(s => s.name === selectedService)?.price} руб.
                  </Typography>
                  <Typography variant="body2">
                    Продолжительность: {services.find(s => s.name === selectedService)?.duration}
                  </Typography>
                </Alert>
              )}

              {/* Кнопка бронирования */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleBookService}
                disabled={!selectedService}
                startIcon={<CalendarMonthIcon />}
                sx={{ 
                  mt: 3, 
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                📅 Забронировать выбранную услугу
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Контакты */}
      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: 'primary.main',
            fontWeight: 'bold'
          }}>
            <PhoneIcon /> Контакты автомойки
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <LocationOnIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Адрес</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    г. Витебск, ул. Автомоечная, д. 1
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <PhoneIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Телефон</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    +375 (25) 777-55-33
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <AccessTimeIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Время работы</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    08:00 - 22:00 (без выходных)
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <EmailIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    info@carwash.ru
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Диалоговое окно подтверждения */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5" align="center" gutterBottom>
            ✅ Услуга забронирована!
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            Администратор подтвердит вашу запись в ближайшее время.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Мы свяжемся с вами для уточнения деталей.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleCloseDialog}
            sx={{ px: 4 }}
          >
            Отлично!
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientPage;