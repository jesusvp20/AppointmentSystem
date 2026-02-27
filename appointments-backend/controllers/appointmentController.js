import appointmentService from '../services/appointmentService.js';

export const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    return res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    // Send specific statuses from service
    const status = error.status || 500;
    return res.status(status).json({
      message: status === 500 ? 'Server error' : error.message,
      ...(status === 500 && { error: error.message }) // Only send technical error log if 500
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const data = await appointmentService.getAppointmentsQuery(req.query);

    if (data.data.length === 0) {
      return res.status(200).json({
        message: 'No appointments found for the provided criteria.',
        ...data
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.cancelAppointment(id);
    return res.status(200).json({
      message: 'Appointment cancelled',
      appointment
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: status === 500 ? 'Server error' : error.message,
      ...(status === 500 && { error: error.message })
    });
  }
};