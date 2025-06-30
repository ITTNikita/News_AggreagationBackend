import { Router } from 'express';
import {AdminController} from '../controllers/adminController';

const router = Router();

router.post('/hide-article-global', AdminController.hideArticleGlobally);
router.post('/hide-category', AdminController.hideCategory);
router.post('/filter-keyword', AdminController.filterArticlesByKeyword);

export  default router;