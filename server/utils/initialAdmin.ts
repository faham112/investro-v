import { db } from '../database/client';
import { users } from '../database/schema';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config();

export const createInitialAdmin = async () => {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminEmail = 'admin@investro.com'; // Default admin email

  if (!adminUsername || !adminPassword) {
    console.warn('Admin username or password not set in .env. Skipping initial admin creation.');
    return;
  }

  try {
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.username, adminUsername),
    });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await db.insert(users).values({
        username: adminUsername,
        email: adminEmail,
        passwordHash,
        role: 'admin',
        balance: '0.00',
        referralCode: 'ADMINREF', // A fixed referral code for admin
      });
      console.log('Initial admin user created successfully!');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  }
};
