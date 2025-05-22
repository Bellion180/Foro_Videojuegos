// Script to create a test user for login testing
const bcrypt = require('bcrypt');
const { createConnection } = require('typeorm');
const dbConfig = require('../config/database');
const User = require('../entities/User');

async function createTestUser() {
  try {
    // Connect to database
    const connection = await createConnection(dbConfig);
    console.log('Connected to database');
    
    const userRepository = connection.getRepository(User);
    
    // Check if test user already exists
    const existingUser = await userRepository.findOne({ 
      where: { email: 'test@example.com' }
    });
    
    if (existingUser) {
      console.log('Test user already exists');
      await connection.close();
      return;
    }
    
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = userRepository.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      bio: 'This is a test user for development',
      avatar: null
    });
    
    await userRepository.save(testUser);
    console.log('Test user created successfully');
    
    // Also create an admin user
    const adminExists = await userRepository.findOne({ 
      where: { email: 'admin@example.com' }
    });
    
    if (!adminExists) {
      const adminHashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = userRepository.create({
        username: 'admin',
        email: 'admin@example.com',
        password: adminHashedPassword,
        role: 'admin',
        bio: 'Administrator account',
        avatar: null
      });
      
      await userRepository.save(adminUser);
      console.log('Admin user created successfully');
    }
    
    await connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();
