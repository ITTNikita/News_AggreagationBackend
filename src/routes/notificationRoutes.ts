import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';

const router = Router();
const notificationController = new NotificationController();

router.get('/:userId', notificationController.getNotifications.bind(notificationController));
router.post('/category', notificationController.savePreference.bind(notificationController));
router.get('/keywords/:userId', notificationController.getKeywords.bind(notificationController));              
router.post('/keywords', notificationController.addKeyword.bind(notificationController));                       
router.put('/keywords/Status', notificationController.updateKeywordStatus.bind(notificationController));      
   

export default router;