import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getUserDashboard, createInvestmentPlan, depositFunds, withdrawFunds } from '../controllers/userController';

const router = Router();

router.get('/dashboard', authenticateToken, getUserDashboard);
router.post('/investment-plans', authenticateToken, createInvestmentPlan);
router.post('/deposit', authenticateToken, depositFunds);
router.post('/withdraw', authenticateToken, withdrawFunds);

export default router;
