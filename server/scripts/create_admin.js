require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Admin details
    const adminData = {
      name: 'kawish iqbal',
      email: 'kawishiqbal898@gmail.com',
      password: '11223344'
    };

    // Check if admin already exists
    const existing = await Admin.findOne({ email: adminData.email.toLowerCase() });
    if (existing) {
      console.log(`Admin with email ${adminData.email} already exists.`);
      process.exit(0);
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminData.password, salt);
    // Create admin
    const admin = await Admin.create({
      name: adminData.name,
      email: adminData.email.toLowerCase(),
      passwordHash: passwordHash
    });

    console.log('✅ Admin created successfully:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   ID: ${admin._id}`);
    console.log('\nYou can now login with:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
