import { Calendar, User, X } from 'lucide-react';
import type { Barber } from '../types';

interface Props {
    filterDate: string;
    filterBarber: string;
    barbers: Barber[];
    onDateChange: (date: string) => void;
    onBarberChange: (barberId: string) => void;
    onClear: () => void;
}

const filterBox = { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '0.5rem 1rem', flex: '1 1 200px', maxWidth: '400px' };
const filterInput = { border: 'none', outline: 'none', backgroundColor: 'transparent', width: '100%', fontSize: '0.875rem' };

export const AppointmentsFilters = ({ filterDate, filterBarber, barbers, onDateChange, onBarberChange, onClear }: Props) => (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={filterBox}>
            <Calendar size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input type="date" value={filterDate} onChange={e => onDateChange(e.target.value)} style={filterInput} />
        </div>

        <div style={filterBox}>
            <User size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <select value={filterBarber} onChange={e => onBarberChange(e.target.value)} style={filterInput}>
                <option value="">All Barbers</option>
                {barbers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
        </div>

        {(filterDate || filterBarber) && (
            <button
                onClick={onClear}
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem' }}
            >
                <X size={16} /> Clear Filters
            </button>
        )}
    </div>
);
