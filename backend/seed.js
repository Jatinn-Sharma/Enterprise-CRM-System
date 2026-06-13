const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  await connectDB();
  try {
    await User.deleteMany();
    
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@crm.com',
      password: 'password123',
      role: 'Admin',
      status: 'Active'
    });

    const testUser = new User({
      name: 'Jatin Sharma',
      email: 'jatinsharma230sharma@gmail.com',
      password: 'password123',
      role: 'Sales Manager',
      status: 'Active'
    });

    await adminUser.save();
    await testUser.save();
    console.log('Users seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedUsers();
