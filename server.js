require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const bookRoutes = require('./routes/bookRoutes');

const mongoose = require('mongoose');

app.use('/api/books', bookRoutes);

async function startServer() {
  if (!MONGO_URI) {
    console.error('MONGO_URI is missing.');
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exitCode = 1;
  }
}

startServer();

module.exports = app;
