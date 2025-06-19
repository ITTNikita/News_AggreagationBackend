import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';

const router = Router();
const controller = new NotificationController();

router.get('/:userId', controller.getNotifications);
router.post('/category', controller.savePreference);

router.get('/keywords/:userId', controller.getKeywords);               // View all keywords
router.post('/keywords', controller.addKeyword);                       // Add new keyword
router.put('/keywords/Status', controller.updateKeywordStatus);       // Enable/Disable
   

export default router;