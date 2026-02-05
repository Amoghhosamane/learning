import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '@/lib/models/User';
import VerificationToken from '@/lib/models/VerificationToken';
import { createVerificationToken, verifyToken } from '@/lib/auth/verification';

let mongo: MongoMemoryServer;

describe('email verification flow', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    // Provide a MONGO_URI env var so server helpers (dbConnect) can use it
    process.env.MONGO_URI = uri;
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('creates a token and verifies the user', async () => {
    const user = await User.create({ name: 'Test', email: 'test@example.com', password: 'pass1234' as any });
    const token = await createVerificationToken(user._id.toString(), 1/24); // short ttl for safety
    expect(typeof token).toBe('string');

    const doc = await VerificationToken.findOne({ token });
    expect(doc).toBeTruthy();

    const res = await verifyToken(token);
    expect(res.success).toBe(true);

    const refreshed = await User.findById(user._id);
    expect(refreshed?.emailVerified).toBe(true);

    const deletedToken = await VerificationToken.findOne({ token });
    expect(!deletedToken).toBe(true);
  });
});