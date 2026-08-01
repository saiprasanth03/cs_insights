import { Author } from '../models/Author.js';

export const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
