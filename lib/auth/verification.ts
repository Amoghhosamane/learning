import crypto from 'crypto';
import VerificationToken from '@/lib/models/VerificationToken';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function createVerificationToken(userId: string, ttlHours = 24) {
  await dbConnect();
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

  await VerificationToken.create({ token, user: userId, expiresAt });
  return token;
}

export async function verifyToken(tokenStr: string) {
  await dbConnect();
  const doc = await VerificationToken.findOne({ token: tokenStr });
  if (!doc) return { success: false, error: 'Invalid token' };
  if (doc.expiresAt < new Date()) {
    await VerificationToken.deleteOne({ _id: doc._id });
    return { success: false, error: 'Token expired' };
  }

  const user = await User.findById(doc.user);
  if (!user) return { success: false, error: 'User not found' };

  user.emailVerified = true;
  await user.save();

  await VerificationToken.deleteOne({ _id: doc._id });

  return { success: true, userId: user._id.toString() };
}
