import { Router } from 'express';
import { getStocks, removeStock, saveStock } from '../controllers/stockController';
import { protect } from '../Middleware/authMiddleware';
import { requireCsrfHeader } from '../Middleware/csrf';

const router = Router();

router.post('/saveStock', requireCsrfHeader, protect, saveStock);
router.post('/removeStock', requireCsrfHeader, protect, removeStock);
router.get('/getStocks', protect, getStocks);

export default router;
