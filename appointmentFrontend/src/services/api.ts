import type { AppointmentDTO } from '../types';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getBarbers = async () => {
    const response = await api.get('/barbers');
    return response.data;
};

export const createBarber = async (name: string) => {
    const response = await api.post('/barbers', { name });
    return response.data;
};

export const getAppointments = async (params?: { date?: string; barberId?: string; page?: number; limit?: number }) => {
    const response = await api.get('/appointments', { params });
    return response.data;
};

export const createAppointment = async (data: AppointmentDTO) => {
    const response = await api.post('/appointments', data);
    return response.data;
};

export const cancelAppointment = async (id: string) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
};
