import { Scissors } from 'lucide-react';

export const Header = () => {
    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <Scissors size={24} color="#fff" />
            </div>
            <h1 style={styles.title}>La Barba VIP</h1>
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: 'var(--primary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    logo: {
        backgroundColor: 'var(--secondary)',
        padding: '0.5rem',
        borderRadius: '8px',
        display: 'flex'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 700,
        letterSpacing: '-0.5px'
    }
};
