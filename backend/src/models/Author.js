import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    avatar: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Author = mongoose.model('Author', AuthorSchema);
