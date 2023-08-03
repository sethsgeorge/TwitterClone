const mongoose = require('mongoose');
const uri = 'mongodb://0.0.0.0:27017/Twitter3';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,

    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};


module.exports = connectDB;