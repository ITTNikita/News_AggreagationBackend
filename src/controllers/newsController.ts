import { Request, Response } from 'express';
import { NewsService } from '../services/newsService';

export class NewsController {
  constructor(public newsService = new NewsService()) {}

  async getTodayArticles(req: Request, res: Response) {
    try {
      console.log("backend called");
      const articles = await this.newsService.fetchTodayArticles();
      console.log("articles fetched", articles);
      res.status(200).json(articles);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch today\'s articles' });
    }
  }

  async getUserPreferenceArticles(req: Request, res: Response) {
    try {
      const userId = req.query.id;
      if (typeof userId !== 'string') {
        res.status(400).json({ message: 'Invalid or missing userId' });
        return;
      }
      const articles = await this.newsService.fetchUserPreferenceArticles(userId);
      res.status(200).json(articles);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch today\'s articles' });
    }
  }

  async getArticlesByFilter(req: Request, res: Response) {
    try {
      const { from, to, category } = req.query;
      const articles = await this.newsService.fetchFilteredArticles(from as string, to as string, category as string);
      res.status(200).json(articles);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  }

  async getAllArticles(req: Request, res: Response) {
    try {
      const { from, to } = req.query;
      const articles = await this.newsService.fetchAllArticles(from as string, to as string);
      console.log("All articles fetched", articles);
      res.status(200).json(articles);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch all articles' });
    }
  }
}
