import { Request, Response } from 'express';
import { AdminService } from '../services/adminServices';

export class AdminController {
  
  static async hideArticleGlobally(req: Request, res: Response) {
    const { articleId } = req.body;
    if (!articleId) {        
        console.log( res.status(400).json({ message: 'Article ID is required.' }));
        return
    }
    await AdminService.hideArticleGlobally(articleId);
     res.json({ message: `Article ${articleId} hidden globally.` });
     return
  }

  static async hideCategory(req: Request, res: Response) {
    const { categoryName } = req.body;
    if (!categoryName) 
    { 
      res.status(400).json({ message: 'Category name is required.' })
      return
    };
    await AdminService.hideCategory(categoryName);
    res.json({ message: `Category "${categoryName}" hidden.` });
    return
  }

  static async filterArticlesByKeyword(req: Request, res: Response) {
    const { keyword } = req.body;
    if (!keyword) { res.status(400).json({ message: 'Keyword is required.' }) ;return;}
    await AdminService.filterArticlesByKeyword(keyword);
     res.json({ message: `Articles containing keyword "${keyword}" will be filtered.` });return;
  }
}