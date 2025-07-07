import { Request, Response } from 'express';
import { ArticleService } from '../services/articleService';
import { logMessage } from '../../logs/logService';
import { log } from 'console';

export class ArticleController {
  constructor(private service: ArticleService = new ArticleService()) {}

  async getSavedArticles(req: Request, res: Response) {
    try {
      logMessage('Get saved articles request received');
      const userId = req.query.userId as string;
      const articles = await this.service.getSavedArticles(userId);
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
      await this.service.saveArticle(req.body);
      res.status(201).json({ message: ' Article saved successfully.' });
      logMessage(`Article with ID ${req.body.article_id} saved for user ${req.body.user_id}`);
    } catch (err: any) {
      if (err.code === 'DUPLICATE') {
        res.status(409).json({ message: ' Article already saved.' });
        logMessage(`Duplicate save attempt for article ID ${req.body.article_id} by user ${req.body.user_id}`);
      } else {
        res.status(500).json({ message: 'Failed to save article.' });
        logMessage(`Error saving article: ${err.message}`);
      }
    }
  }

  async deleteArticle(req: Request, res: Response) {
    try {
      logMessage('Delete article request received');
      const { userId, articleId } = req.params;
      await this.service.deleteArticle(userId, articleId);
      res.status(200).json({ message: ' Article deleted successfully.' });
      logMessage(`Article with ID ${articleId} deleted for user ${userId}`);
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete article.' });
    }
  }
}
