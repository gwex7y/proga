import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../Axios/api';

// Асинхронное действие (Axios)
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async () => {
    const response = await api.get('/users');
    return response.data.map(user => ({
      name: user.name,
      car: 'Тестовое Авто',
      phone: user.phone,
      visits: 0,
      totalSpent: 0
    }));
  }
);

const loadFromStorage = () => {
  const saved = localStorage.getItem("clients");
  return saved ? JSON.parse(saved) : [];
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    list: loadFromStorage(),
    isModalOpen: false,
    editingIndex: null,
    status: 'idle',
  },
  reducers: {
    addClient: (state, action) => {
      state.list.push(action.payload);
      localStorage.setItem("clients", JSON.stringify(state.list));
      state.isModalOpen = false;
    },
    updateClient: (state, action) => {
      const { index, client } = action.payload;
      state.list[index] = client;
      localStorage.setItem("clients", JSON.stringify(state.list));
      state.isModalOpen = false;
      state.editingIndex = null;
    },
    deleteClient: (state, action) => {
      state.list = state.list.filter((_, i) => i !== action.payload);
      localStorage.setItem("clients", JSON.stringify(state.list));
    },
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.editingIndex = action.payload !== undefined ? action.payload : null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingIndex = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      state.list = [...state.list, ...action.payload];
      localStorage.setItem("clients", JSON.stringify(state.list));
    });
  }
});

export const { addClient, updateClient, deleteClient, openModal, closeModal } = clientsSlice.actions;
export default clientsSlice.reducer;