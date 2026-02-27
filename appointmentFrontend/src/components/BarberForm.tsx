import { useState } from 'react';
import toast from 'react-hot-toast';
import { createBarber } from '../services/api';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export const BarberForm = ({ onClose, onSuccess }: Props) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Barber name is required');

        setLoading(true);
        try {
            await createBarber(name.trim());
            toast.success('Barber created successfully! 🎉');
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
                <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>New Barber</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={styles.label}>Full Name</label>
                        <input
                            autoFocus
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={styles.input}
                            placeholder="Write the barber name"
                        />
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
        alignItems: 'center', justifyContent: 'center', zIndex: 60,
        padding: '1rem'
    },
    modal: {
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(16px)',
        padding: '2rem',
        borderRadius: 'var(--radius)', width: '100%', maxWidth: '400px',
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
