
import { Router } from 'express';
import authenticationRountes from './authenticationRoutes';
import newsRoutes from './newsRoutes';
import serverRoutes from './externalServerRoutes';
import notificationRoutes from './notificationRoutes';
import articleRoutes from './articleRoutes';

const router = Router();

router.use('/users', authenticationRountes);
router.use('/news', newsRoutes);
router.use('/external-servers', serverRoutes);
router.use('/notifications', notificationRoutes);
router.use('/saved-articles', articleRoutes)
export default router;
