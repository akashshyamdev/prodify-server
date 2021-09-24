import { Router } from 'express';
import upload from '../config/multer';
import {
  createDeveloper,
  deleteDeveloper,
  getAllDevelopers,
  getDeveloper,
  githubLoginDeveloper,
  googleLoginDeveloper,
  loginDeveloper, resetAndSeedDB,
  updateDeveloper,
  uploadDeveloperMedia
} from '../controllers/developers';

const router = Router();

router.get('/', getAllDevelopers);
router.get('/:id', getDeveloper);

router.post('/signup', createDeveloper);
router.post('/login', loginDeveloper);

router.post('/google-auth', googleLoginDeveloper);
router.post('/github-auth', githubLoginDeveloper);

router.put('/:id', updateDeveloper);
router.delete('/:id', deleteDeveloper);

router.post('/upload', upload.single('image'), uploadDeveloperMedia);

if(process.env.NODE_ENV === 'development') {
  router.post('/seed', resetAndSeedDB);
}

export default router;
