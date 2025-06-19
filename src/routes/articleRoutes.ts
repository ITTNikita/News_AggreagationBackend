import { Router } from 'express';
import { ArticleController } from '../controllers/articleController';

const router = Router();
const controller = new ArticleController();

router.get('/', controller.getSavedArticles);
router.post('/', controller.saveArticle);
router.delete('/:userId/:articleId', controller.deleteArticle);

export default router;