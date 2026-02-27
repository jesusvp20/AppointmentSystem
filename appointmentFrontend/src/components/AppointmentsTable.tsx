import { Calendar, Clock, Trash2 } from 'lucide-react';
import type { Appointment } from '../types';

interface Props {
    appointments: Appointment[];
    loading: boolean;
    onCancel: (id: string) => void;
}

const th = { padding: '1rem', fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.875rem' };
const td = { padding: '1rem', whiteSpace: 'nowrap' as const };
const empty = { padding: '3rem', textAlign: 'center' as const, color: 'var(--text-muted)' };
const badge = { backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500 };
const delBtn = { backgroundColor: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' };

export const AppointmentsTable = ({ appointments, loading, onCancel }: Props) => (
    <div style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', overflowX: 'auto' }}>
        <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                    <th style={th}>Customer</th>
                    <th style={th}>Barber</th>
                    <th style={th}>Date & Time</th>
                    <th style={th}>Duration</th>
                    <th style={{ ...th, textAlign: 'right' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr><td colSpan={5} style={empty}>Loading data...</td></tr>
                ) : appointments.length === 0 ? (
                    
                    <tr>
                        <td colSpan={5} style={empty}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}>
                                <Calendar size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                                No appointments found
                            </div>
                        </td>
                    </tr>
                ) : (
                    appointments.map(apt => (
                        <tr key={apt._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={td}>
                                <div style={{ fontWeight: 500 }}>{apt.customerName}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{apt.customerPhone}</div>
                            </td>
                            
                            <td style={td}>{typeof apt.barberId === 'object' ? apt.barberId.name : 'Unknown'}</td>
                            <td style={td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                    
                                    <span>{apt.start.split(' ')[0]}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <Clock size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{apt.start.split(' ')[1]}</span>
                                </div>
                            </td>
                            <td style={td}>
                                <span style={badge}>{apt.durationMin} min</span>
                            </td>
                            <td style={{ ...td, textAlign: 'right' }}>
                                <button onClick={() => onCancel(apt._id)} style={delBtn} title="Cancel">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);
