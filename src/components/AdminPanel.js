import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addClient, 
  updateClient, 
  deleteClient, 
  openModal, 
  closeModal, 
  fetchClients 
} from '../redux/slice'; 

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
  Snackbar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  CloudDownload as CloudDownloadIcon
} from '@mui/icons-material';

const AdminPanel = () => {
  const dispatch = useDispatch();
  // Достаем данные из Redux
  const { list: clients, isModalOpen, editingIndex } = useSelector((state) => state.clients);

  // Локальные стейты для формы
  const [name, setName] = useState("");
  const [car, setCar] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ name: '', car: '', phone: '' });

  // Локальные стейты для записей (оставляем как было)
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("appointments");
    return saved ? JSON.parse(saved) : [];
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user, logoutUser, toggleTheme, mode } = useContext(AuthContext);

  // Сохранение записей
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  // Заполнение формы при редактировании
  useEffect(() => {
    if (editingIndex !== null && isModalOpen) {
      const client = clients[editingIndex];
      setName(client.name);
      setCar(client.car);
      setPhone(client.phone);
    } else if (!isModalOpen) {
      setName("");
      setCar("");
      setPhone("");
      setErrors({ name: '', car: '', phone: '' });
    }
  }, [editingIndex, isModalOpen, clients]);

  // Валидация
  useEffect(() => {
    if (!isModalOpen) return;
    setErrors({
      name: name.trim() === '' ? 'Имя обязательно' : '',
      car: car.trim() === '' ? 'Марка обязательна' : '',
      phone: phone.trim() === '' ? 'Телефон обязателен' : '',
    });
  }, [name, car, phone, isModalOpen]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // --- REDUX ACTIONS ---
  const handleEdit = (index) => dispatch(openModal(index));
  const handleDelete = (index) => {
    if (window.confirm("Удалить клиента?")) {
      dispatch(deleteClient(index));
      showSnackbar('Клиент удален', 'success');
    }
  };
  const handleOpenAddModal = () => dispatch(openModal(null));
  const handleCloseModal = () => dispatch(closeModal());
  
  const handleSaveClient = () => {
    if (name.trim() === '' || car.trim() === '' || phone.trim() === '') {
      showSnackbar('Заполните поля', 'error');
      return;
    }
    const clientData = { name, car, phone, visits: 0, totalSpent: 0 };
    
    if (editingIndex !== null) {
      const oldClient = clients[editingIndex];
      dispatch(updateClient({ 
        index: editingIndex, 
        client: { ...clientData, visits: oldClient.visits, totalSpent: oldClient.totalSpent } 
      }));
      showSnackbar('Обновлено', 'success');
    } else {
      dispatch(addClient(clientData));
      showSnackbar('Добавлено', 'success');
    }
  };

  const handleLoadFakeData = () => {
    dispatch(fetchClients())
      .unwrap()
      .then(() => showSnackbar('Данные загружены (Axios)', 'success'))
      .catch(() => showSnackbar('Ошибка загрузки', 'error'));
  };

  // --- APPOINTMENT LOGIC (Старая) ---
  const handleConfirmAppointment = (index) => {
    setAppointments(prev => {
      const up = [...prev];
      up[index] = { ...up[index], status: 'confirmed', confirmedAt: new Date().toLocaleString() };
      return up;
    });
  };

  const handleRejectAppointment = (index) => {
    const r = prompt('Причина?');
    if (!r) return;
    setAppointments(prev => {
      const up = [...prev];
      up[index] = { ...up[index], status: 'rejected', rejectionReason: r };
      return up;
    });
  };

  const handleCompleteAppointment = (index) => {
    if (!window.confirm('Завершить?')) return;
    setAppointments(prev => {
      const up = [...prev];
      up[index] = { ...up[index], status: 'completed', completedAt: new Date().toLocaleString() };
      
      // Обновляем статистику клиента в Redux
      const cName = up[index].clientName;
      const cIndex = clients.findIndex(c => c.name === cName);
      if (cIndex !== -1) {
        const cl = clients[cIndex];
        dispatch(updateClient({ 
          index: cIndex, 
          client: { ...cl, visits: (cl.visits||0)+1, totalSpent: (cl.totalSpent||0)+up[index].price } 
        }));
      }
      return up;
    });
    showSnackbar('Готово', 'success');
  };

  const handleGlobalSave = () => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
    showSnackbar('Сохранено', 'success');
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const canSave = name && car && phone && !errors.name && !errors.car && !errors.phone;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5"><DirectionsCarIcon/> Админ Панель</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title="Тема"><IconButton onClick={toggleTheme} color="inherit">{mode === 'light' ? <Brightness4Icon/> : <Brightness7Icon/>}</IconButton></Tooltip>
            <Chip icon={<PersonIcon/>} label={`Админ: ${user?.username}`} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}/>
            <Button variant="contained" color="secondary" onClick={logoutUser} startIcon={<LogoutIcon/>}>Выйти</Button>
          </Box>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Клиенты ({clients.length})</Typography>
                <Box>
                  <Tooltip title="Загрузить через Axios">
                    <IconButton color="primary" onClick={handleLoadFakeData}><CloudDownloadIcon/></IconButton>
                  </Tooltip>
                  <Button variant="contained" startIcon={<AddIcon/>} onClick={handleOpenAddModal}>Добавить</Button>
                </Box>
              </Box>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.light' }}>
                      <TableCell sx={{ color:'white' }}>Имя</TableCell>
                      <TableCell sx={{ color:'white' }}>Авто</TableCell>
                      <TableCell sx={{ color:'white' }}>Телефон</TableCell>
                      <TableCell sx={{ color:'white' }}>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clients.map((c, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.car}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary" onClick={() => handleEdit(i)}><EditIcon/></IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(i)}><DeleteIcon/></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Записи ({appointments.length})</Typography>
              
              {pendingAppointments.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography color="warning.main" variant="subtitle1">Новые</Typography>
                  {pendingAppointments.map((a) => {
                     const gIdx = appointments.findIndex(x => x.id === a.id);
                     return (
                      <Card key={a.id} sx={{ p: 1, mb: 1, borderLeft: '4px solid orange' }}>
                        <Grid container alignItems="center">
                          <Grid item xs={8}><Typography variant="body2">{a.clientName} - {a.serviceName}</Typography></Grid>
                          <Grid item xs={4} align="right">
                             <IconButton color="success" onClick={() => handleConfirmAppointment(gIdx)}><CheckIcon/></IconButton>
                             <IconButton color="error" onClick={() => handleRejectAppointment(gIdx)}><CloseIcon/></IconButton>
                          </Grid>
                        </Grid>
                      </Card>
                     )
                  })}
                </Box>
              )}
              
              {confirmedAppointments.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography color="success.main" variant="subtitle1">В работе</Typography>
                  {confirmedAppointments.map((a) => {
                     const gIdx = appointments.findIndex(x => x.id === a.id);
                     return (
                      <Card key={a.id} sx={{ p: 1, mb: 1, borderLeft: '4px solid green' }}>
                        <Grid container alignItems="center">
                          <Grid item xs={8}><Typography variant="body2">{a.clientName} - {a.serviceName}</Typography></Grid>
                          <Grid item xs={4} align="right">
                             <Button size="small" variant="contained" onClick={() => handleCompleteAppointment(gIdx)}><DoneIcon/></Button>
                          </Grid>
                        </Grid>
                      </Card>
                     )
                  })}
                </Box>
              )}

              {completedAppointments.length > 0 && (
                 <Box><Typography color="info.main">История: {completedAppointments.length}</Typography></Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button variant="contained" onClick={handleGlobalSave} startIcon={<SaveIcon/>}>Сохранить всё</Button>
      </Box>

      {/* МОДАЛКА */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingIndex !== null ? 'Редактировать' : 'Новый клиент'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Имя" value={name} onChange={e=>setName(e.target.value)} error={!!errors.name} helperText={errors.name}/>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Авто" value={car} onChange={e=>setCar(e.target.value)} error={!!errors.car} helperText={errors.car}/>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Телефон" value={phone} onChange={e=>setPhone(e.target.value)} error={!!errors.phone} helperText={errors.phone}/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="error">Отмена</Button>
          <Button variant="contained" onClick={handleSaveClient} disabled={!canSave}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;