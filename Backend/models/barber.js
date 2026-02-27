
import mongoose from 'mongoose';

const barberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

barberSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString().replace('T', ' ').substring(0, 16);
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString().replace('T', ' ').substring(0, 16);
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Barber", barberSchema);