import { Router } from 'express';
import { login, logout, register } from '../controllers/authController';
import { requireCsrfHeader } from '../Middleware/csrf';

const router = Router();

router.post('/register', requireCsrfHeader, register);
router.post('/login', requireCsrfHeader, login);
router.post('/logout', requireCsrfHeader, logout);

export default router;
