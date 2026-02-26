import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
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
    });
  })
  .catch(err => console.error(err));