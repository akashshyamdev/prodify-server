import { Router } from 'express';
import multer from '../config/multer';
import { createNote, getAllNotes } from '../controllers/notes';
import protect from '../middleware/protect';

const router = Router();

router.get('/', protect, getAllNotes);
router.post('/', protect, multer.single('audio'), createNote);

export default router;
