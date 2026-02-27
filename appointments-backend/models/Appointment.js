import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },

  customerPhone: {
    type: String,
    required: true,
    trim: true
  },

  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true
  },

  start: {
    type: Date,
    required: true
  },

  durationMin: {
    type: Number,
    required: true,
    enum: [30, 45, 60]// Bussnies rule: only allow 30, 45, or 60 minute appointments
  },

  status: {
    type: String,
    enum: ['scheduled', 'cancelled'],
    default: 'scheduled'
  }

}, {
  timestamps: true
});


// Business Rule: prevent double booking
appointmentSchema.index(
  { barberId: 1, start: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'scheduled' }
  }
);

appointmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.start) {
      // Format as "YYYY-MM-DD HH:mm"
      ret.start = ret.start.toISOString().replace('T', ' ').substring(0, 16);
    }
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString().replace('T', ' ').substring(0, 16);
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString().replace('T', ' ').substring(0, 16);
    delete ret.__v; // Optionally hide the internal version key
    return ret;
  }
});

export default mongoose.model('Appointment', appointmentSchema); 