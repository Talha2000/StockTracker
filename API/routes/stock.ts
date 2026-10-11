import { Router } from 'express';
import { getStocks, removeStock, saveStock } from '../controllers/stockController';
import { protect } from '../Middleware/authMiddleware';

const router = Router();

router.post('/saveStock', protect, saveStock);
router.post('/removeStock', protect, removeStock);
router.get('/getStocks', protect, getStocks);

export default router;
