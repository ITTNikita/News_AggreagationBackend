import { Request, Response } from 'express';
import { NewsService } from '../services/newsService';

const newsService = new NewsService();

export class NewsController {
  async getTodayArticles(req: Request, res: Response) {
    try {
      console.log('Fetching today\'s articles');
      const articles = await newsService.fetchTodayArticles();
      res.status(200).json(articles);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch today\'s articles' });
    }
  }

  async getArticlesByFilter(req: Request, res: Response) {
    try {
      const { from, to, category } = req.query;
      const articles = await newsService.fetchFilteredArticles(from as string, to as string, category as string);
      res.status(200).json(articles);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  }

  async getAllArticles(req: Request, res: Response) {
    try {
      const { from, to } = req.query;
      const articles = await newsService.fetchAllArticles(from as string, to as string);
      res.status(200).json(articles);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch all articles' });
    }
  }
}