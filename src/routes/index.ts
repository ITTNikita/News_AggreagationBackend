
import { Router } from 'express';
import authenticationRountes from './authenticationRoutes';
import newsRoutes from './newsRoutes';
import serverRoutes from './externalServerRoutes';
import notificationRoutes from './notificationRoutes';
import articleRoutes from './articleRoutes';
import feedBackRoutes from './feedBackRoutes';
import adminRoutes from './adminRoutes'

const router = Router();

router.use('/users', authenticationRountes);
router.use('/news', newsRoutes);
router.use('/external-servers', serverRoutes);
router.use('/notifications', notificationRoutes);
router.use('/saved-articles', articleRoutes)
router.use('/feedback',feedBackRoutes)
router.use('/admin',adminRoutes)
export default router;
