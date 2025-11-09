import { Router } from 'express';
import { adminLogin, getAdminDashboard, getAllUsers, updateUserBalance, approveDeposit, rejectDeposit, approveWithdrawal, rejectWithdrawal } from '../controllers/adminController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/admin/login', adminLogin);
router.get('/admin/dashboard', authenticateToken, authorizeRole(['admin']), getAdminDashboard);
router.get('/admin/users', authenticateToken, authorizeRole(['admin']), getAllUsers);
router.put('/admin/users/:userId/balance', authenticateToken, authorizeRole(['admin']), updateUserBalance);
router.put('/admin/deposits/:transactionId/approve', authenticateToken, authorizeRole(['admin']), approveDeposit);
router.put('/admin/deposits/:transactionId/reject', authenticateToken, authorizeRole(['admin']), rejectDeposit);
router.put('/admin/withdrawals/:transactionId/approve', authenticateToken, authorizeRole(['admin']), approveWithdrawal);
router.put('/admin/withdrawals/:transactionId/reject', authenticateToken, authorizeRole(['admin']), rejectWithdrawal);

export default router;
