import { Request, Response } from 'express';
import { ArticleService } from '../services/articleService';

const savedService = new ArticleService();

export class ArticleController {
  async getSavedArticles(req: Request, res: Response) {
    try {
      const userId = req.query.userId as string;
      const articles = await savedService.getSavedArticles(userId);

      const formattedResults = (articles as any[]).map((row, index) => ({
      id: index + 1,
      article_id: row.article_id,
      title: row.title,
      description: row.description,
      source_name: row.source_name,
      url: row.url,
      category: row.category,
      saved_at: new Date(row.saved_at).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
    
      res.status(200).json(formattedResults);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch saved articles' });
    }
  }

  async saveArticle(req: Request, res: Response) {
    try {
      await savedService.saveArticle(req.body);
      res.status(201).json({ message: ' Article saved successfully.' });
    } catch (err: any) {
      if (err.code === 'DUPLICATE') {
        res.status(409).json({ message: ' Article already saved.' });
      } else {
        res.status(500).json({ message: 'Failed to save article.' });
      }
    }
  }

  async deleteArticle(req: Request, res: Response) {
    try {
      const { userId, articleId } = req.params;
      await savedService.deleteArticle(userId, articleId);
      res.status(200).json({ message: ' Article deleted successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete article.' });
    }
  }
}