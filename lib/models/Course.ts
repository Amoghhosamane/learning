import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  lessons: [{
    title: String,
    duration: String,
    videoUrl: String,
    content: String,
    order: Number,
  }],
  students: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  published: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);