// seed.js
/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const Donator = require('./donator');
const Receiver = require('./receiver');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/team19db';

async function main() {
  // 1) Connect
  await mongoose.connect(MONGODB_URI);

  console.log('✅ MongoDB connected');

  // 2) Start fresh (delete only these collections)
  await Promise.all([Donator.deleteMany({}), Receiver.deleteMany({})]);
  console.log('🧹 Cleared Donator & Receiver collections');

  // 3) Seed data (use create for brevity + validation)
  const [donator, receiver] = await Promise.all([
    Donator.create({
      name: 'aman',
      passport: 'faf',
      email: 'abe@', // consider a real-looking test email for validators
      address: 'grea',
      inNeed: [{ photos: [], description: '', quantity: 10 }],
      history: [],
    }),
    Receiver.create({
      name: 'ngo',
      passport: 'jaoj',
      email: 'bob@afoj', // consider a real-looking test email for validators
      address: 'fjwj',
      needs: [{ photos: [], description: 'good', quantity: 5, category: 'book' }],
      history: [],
    }),
  ]);

  console.log('📦 Inserted documents:');
  console.table([
    { collection: 'Donator', id: donator._id.toString(), name: donator.name },
    { collection: 'Receiver', id: receiver._id.toString(), name: receiver.name },
  ]);
}

// Execute and always close the connection
main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close().catch(() => {});
    console.log('👋 MongoDB connection closed');
  });
