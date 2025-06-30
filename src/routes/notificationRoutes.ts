import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';

const router = Router();
const controller = new NotificationController();

router.get('/:userId', controller.getNotifications);
router.post('/category', controller.savePreference);
router.get('/keywords/:userId', controller.getKeywords);              
router.post('/keywords', controller.addKeyword);                       
router.put('/keywords/Status', controller.updateKeywordStatus);      
   

export default router;