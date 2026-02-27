import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { AppointmentsPage } from './pages/AppointmentsPage';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="top-right" />
      <Header />

      <main className="container" style={{ flex: 1, width: '100%' }}>
        <AppointmentsPage />
      </main>
    </div>
  );
}

export default App;
