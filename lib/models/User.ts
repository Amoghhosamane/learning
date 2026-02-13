// lib/models/User.ts
import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // hide by default
    },
    memberId: {
      type: String,
      unique: true,
      sparse: true, // allows null values while maintaining uniqueness
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate memberId before saving (if not set)
UserSchema.pre("save", async function (next) {
  if (!this.memberId) {
    // Generate unique 8-character alphanumeric ID
    let unique = false;
    while (!unique) {
      const id = crypto.randomBytes(4).toString('hex').toUpperCase();
      const existing = await mongoose.models.User?.findOne({ memberId: id });
      if (!existing) {
        this.memberId = id;
        unique = true;
      }
    }
  }
  next();
});

// Auto-hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password as string, 10);
  next();
});

const User = models.User || model("User", UserSchema);
export default User;
