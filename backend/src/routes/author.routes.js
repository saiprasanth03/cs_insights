import express from 'express';
import { getAuthors } from '../controllers/author.controller.js';

const router = express.Router();

router.get('/', getAuthors);

export default router;
