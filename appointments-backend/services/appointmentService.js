import Appointment from '../models/Appointment.js';
import Barber from '../models/barber.js';
import { paginate } from '../utils/pagination.js';

class AppointmentService {

    async createAppointment(data) {
        const { customerName, customerPhone, barberId, start, durationMin } = data;

        if (!customerName || !customerPhone || !barberId || !start || !durationMin) {
            const error = new Error('All fields are required');
            error.status = 400;
            throw error;
        }

        // Validate phone format (allows digits, spaces, dashes, and a leading +)
        const phoneRegex = /^[+]?[\d\s-]+$/;
        if (!phoneRegex.test(customerPhone)) {
            const error = new Error('Invalid phone format. Only digits, +, -, and spaces are allowed.');
            error.status = 400;
            throw error;
        }

        // Validate active barber
        const barber = await Barber.findOne({ _id: barberId, active: true });
        if (!barber) {
            const error = new Error('Barber not found or inactive');
            error.status = 404;
            throw error;
        }

        // Duration must be 30, 45, or 60 min
        if (![30, 45, 60].includes(durationMin)) {
            const error = new Error('Duration must be 30, 45, or 60 minutes');
            error.status = 400;
            throw error;
        }

        const startDate = new Date(start);
        if (isNaN(startDate.getTime())) {
            const error = new Error('Invalid date format. Use ISO string');
            error.status = 400;
            throw error;
        }

        // Validate time overlaps (duration logic)
        const endTime = new Date(startDate.getTime() + durationMin * 60000);

        const startOfDay = new Date(startDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(startDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const checkOverlaps = await Appointment.find({
            barberId,
            status: 'scheduled',
            start: { $gte: startOfDay, $lte: endOfDay }
        });

        //looking for overlaps in the time slot 
        for (const apt of checkOverlaps) {
            const aptStart = new Date(apt.start);
            const aptEnd = new Date(aptStart.getTime() + apt.durationMin * 60000);

            if (startDate < aptEnd && aptStart < endTime) {
                const error = new Error('This time slot overlaps with an existing appointment');
                error.status = 409;
                throw error;
            }
        }

        const newAppointment = new Appointment({
            customerName,
            customerPhone,
            barberId,
            start: startDate,
            durationMin,
            status: 'scheduled'
        });
     //validation if exists an exact time slot
        try {
            await newAppointment.save();
            await newAppointment.populate('barberId', 'name');
            return newAppointment;
        } catch (saveError) {

            if (saveError.code === 11000) {
                const conflictError = new Error('This exact time slot is already booked');
                conflictError.status = 409;
                throw conflictError;
            }
            throw saveError;
        }
    }


    //get appointments with pagination
    async getAppointmentsQuery(queryObj) {
        const { date, barberId, page, limit } = queryObj;
        const filter = { status: 'scheduled' };

        if (barberId) filter.barberId = barberId;

        if (date) {
            const requestedDate = new Date(date);
            if (!isNaN(requestedDate.getTime())) {
                const startOfDay = new Date(requestedDate);
                startOfDay.setUTCHours(0, 0, 0, 0);
                const endOfDay = new Date(requestedDate);
                endOfDay.setUTCHours(23, 59, 59, 999);

                filter.start = { $gte: startOfDay, $lte: endOfDay };
            }
        }

        return await paginate(Appointment, filter, {
            page,
            limit,
            populate: { path: 'barberId', select: 'name' }
        });
    }

    //cancel appointment
    async cancelAppointment(id) {
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true }
        ).populate('barberId', 'name');

        if (!appointment) {
            const error = new Error('Appointment not found');
            error.status = 404;
            throw error;
        }

        return appointment;
    }
}

export default new AppointmentService();
