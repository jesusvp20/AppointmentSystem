import Barber from '../models/barber.js';
import { paginate } from '../utils/pagination.js';

export const createBarber = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Name is required'
      });
    }

    const barber = new Barber({ name });
    await barber.save();

    return res.status(201).json(barber);
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
}

export const getBarbers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    // Paginating active barbers
    const data = await paginate(Barber, { active: true }, { page, limit });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
}
