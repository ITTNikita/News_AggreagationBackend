import { Router } from 'express';
import { NewsController } from '../controllers/newsController';

const router = Router();
const controller = new NewsController();

router.get('/today-articles', controller.getTodayArticles);
router.get('/articles', controller.getArticlesByFilter);
router.get('/all-articles', controller.getAllArticles);

export default router;