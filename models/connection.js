const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

async function connectDB() {
  try {
    await mongoose.connect(connectionString, { connectTimeoutMS: 2000 });
    console.log('Database connected');
  } catch (error) {
    console.error(error);
  }
}
connectDB();