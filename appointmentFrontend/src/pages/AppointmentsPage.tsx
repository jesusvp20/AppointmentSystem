import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AppointmentForm } from '../components/AppointmentForm';
import { BarberForm } from '../components/BarberForm';
import { AppointmentsTable } from '../components/AppointmentsTable';
import { AppointmentsFilters } from '../components/AppointmentsFilters';
import { getAppointments, getBarbers, cancelAppointment } from '../services/api';
import type { Appointment, Barber } from '../types';
import { Plus } from 'lucide-react';


export const AppointmentsPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openBarberModal, setOpenBarberModal] = useState(false);

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [filterDate, setFilterDate] = useState('');
    const [filterBarber, setFilterBarber] = useState('');
    const [loading, setLoading] = useState(true);

    const loadBarbers = async () => {
        try {
            const res = await getBarbers();
            setBarbers(res.data || res);
        } catch {
            toast.error('Error loading barbers');
        }
    };
    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const data = await getAppointments({ date: filterDate, barberId: filterBarber });
            setAppointments(data.data || data);
        } catch{
            toast.error('Error loading appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadBarbers(); }, []);
    useEffect(() => { fetchAppointments(); }, [filterDate, filterBarber]);
  

    const handleCancel = async (id: string) => {
        if (!window.confirm('Cancel this appointment?')) return;
        try {
            await cancelAppointment(id);
            toast.success('Cancelled successfully');
            fetchAppointments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error cancelling');
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Agenda</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={() => setOpenBarberModal(true)} style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Plus size={16} /> New Barber
                    </button>
                    <button className="btn" onClick={() => setOpenModal(true)} style={{ whiteSpace: 'nowrap' }}>
                        + New Appointment
                    </button>
                </div>
            </div>

            <AppointmentsFilters
                filterDate={filterDate}
                filterBarber={filterBarber}
                barbers={barbers}
                onDateChange={setFilterDate}
                onBarberChange={setFilterBarber}
                onClear={() => { setFilterDate(''); setFilterBarber(''); }}
            />

            <AppointmentsTable
                appointments={appointments}
                loading={loading}
                onCancel={handleCancel}
            />

            {openModal && <AppointmentForm onClose={() => setOpenModal(false)} onSuccess={() => { setOpenModal(false); fetchAppointments(); }} />}
            {openBarberModal && <BarberForm onClose={() => setOpenBarberModal(false)} onSuccess={() => { setOpenBarberModal(false); loadBarbers(); }} />}
        </div>
    );
};
