import { Router } from 'express';
import { NewsController } from '../controllers/newsController';

const router = Router();
const newsController = new NewsController();

router.get('/today-articles', newsController.getTodayArticles.bind(newsController));
router.get('/user-preference-articles',newsController.getUserPreferenceArticles.bind(newsController))
router.get('/articles', newsController.getArticlesByFilter.bind(newsController));
router.get('/all-articles', newsController.getAllArticles.bind(newsController));

export default router;