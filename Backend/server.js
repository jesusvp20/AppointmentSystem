import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.js';

import barberRoutes from './routes/barber.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { MONGO_URI, PORT } = process.env;
if (!MONGO_URI) {
  console.error('MONGO_URI environment variable is required');
  process.exit(1);
}
if (!PORT) {
  console.error('PORT environment variable is required');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => console.error(err));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/barbers', barberRoutes);
app.use('/api/appointments', appointmentRoutes);