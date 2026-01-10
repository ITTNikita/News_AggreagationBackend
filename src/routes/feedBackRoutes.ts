import { Router } from 'express';
import { FeedBackController } from '../controllers/feedbackController';

const router = Router();
const feedbackController = new FeedBackController();
 
router.post('/', feedbackController.setFeedback.bind(feedbackController));
router.post('/ReportArticle',feedbackController.reportArticle.bind(feedbackController));
 
export default router;