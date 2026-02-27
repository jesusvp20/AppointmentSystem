import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createAppointment, getBarbers } from '../services/api';
import type { Barber } from '../types';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export const AppointmentForm = ({ onClose, onSuccess }: Props) => {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        customerName: '',
        customerPhone: '',
        barberId: '',
        date: '',
        time: '',
        durationMin: 30
    });

    useEffect(() => {
        getBarbers()
            .then(res => setBarbers(res.data || res))
            .catch(() => toast.error('Error loading barbers'));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'durationMin' ? Number(value) : value }));
    };

   
    const validate = () => {
        if (!form.customerName.trim()) return 'Name required';
        if (!/^[+]?[\d\s-]+$/.test(form.customerPhone)) return 'Invalid phone format';
        if (!form.barberId) return 'Select a barber';
        if (!form.date || !form.time) return 'Select date and time';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validate();
        if (error) return toast.error(error);

        setLoading(true);
        try {
            const startDateTime = `${form.date}T${form.time}:00.000Z`;

            await createAppointment({
                ...form,
                start: startDateTime
            });

            toast.success('Appointment created!');
            onSuccess();
        } catch (err: any) {
            
            toast.error(err.response?.data?.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>New Appointment</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={styles.label}>Full Name</label>
                        <input name="customerName" value={form.customerName} onChange={handleChange} style={styles.input} placeholder="Write full name" />
                    </div>

                    <div>
                        <label style={styles.label}>Phone Number</label>
                        <input name="customerPhone" value={form.customerPhone} onChange={handleChange} style={styles.input} placeholder="Write phone number" />
                    </div>

                    <div>
                        <label style={styles.label}>Barber</label>
                        <select name="barberId" value={form.barberId} onChange={handleChange} style={styles.input}>
                            <option value="">Select Professional</option>
                            {barbers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 150px' }}>
                            <label style={styles.label}>Date</label>
                            <input type="date" name="date" value={form.date} onChange={handleChange} style={styles.input} />
                        </div>
                        <div style={{ flex: '1 1 150px' }}>
                            
                            <label style={styles.label}>Time (UTC)</label>
                            <input type="time" name="time" value={form.time} onChange={handleChange} style={styles.input} />
                        </div>
                    </div>

                    <div>
                        <label style={styles.label}>Duration</label>
                        <select name="durationMin" value={form.durationMin} onChange={handleChange} style={styles.input}>
                            <option value={30}>30 min</option>
                            <option value={45}>45 min</option>
                            <option value={60}>60 min</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.15)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 50,
        padding: '1rem'
    },
  
    modal: {
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(16px)',
        padding: '2rem',
        borderRadius: 'var(--radius)', width: '100%', maxWidth: '500px',
        maxHeight: '90vh', overflowY: 'auto' as const,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
    },
    label: { display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 },
    input: {
        width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)',
        border: '1px solid var(--border-color)', outline: 'none'
    }
};
