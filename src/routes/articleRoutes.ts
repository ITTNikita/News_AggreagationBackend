import { Router } from 'express';
import { ArticleController } from '../controllers/articleController';

const router = Router();
const articleController = new ArticleController();

router.get('/', articleController.getSavedArticles.bind(articleController));
router.post('/', articleController.saveArticle.bind(articleController));
router.delete('/:userId/:articleId', articleController.deleteArticle.bind(articleController));

export default router;