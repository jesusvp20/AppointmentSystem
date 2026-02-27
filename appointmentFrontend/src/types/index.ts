export interface Barber {
    _id: string;
    name: string;
}

export interface Appointment {
    _id: string;
    customerName: string;
    customerPhone: string;
    barberId: Barber | string; 
    start: string;             
    durationMin: number;
    status: string;
}

export interface AppointmentDTO {
    customerName: string;
    customerPhone: string;
    barberId: string;
    start: string;  
    durationMin: number;
}
