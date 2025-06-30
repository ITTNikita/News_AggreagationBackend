import { Router } from 'express';
import { FeedBackController } from '../controllers/feedbackController';

const router = Router();
const controller = new FeedBackController();
 
router.post('/', controller.setFeedback);
router.post('/ReportArticle',controller.reportArticle)
 
export default router;