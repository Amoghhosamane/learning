import mongoose, { Schema, model, models } from 'mongoose';

const VerificationTokenSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const VerificationToken = models.VerificationToken || model('VerificationToken', VerificationTokenSchema);
export default VerificationToken;