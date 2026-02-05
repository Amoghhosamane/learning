import mongoose, { Schema, model, models } from "mongoose";

const LiveSessionSchema = new Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.LiveSession || model("LiveSession", LiveSessionSchema);
