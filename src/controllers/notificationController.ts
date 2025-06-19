import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: Request, res: Response) {
    try {
      console.log("router of notifications",req.params.userId)
      const data = await notificationService.getUserNotifications(req.params.userId);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching notifications' });
    }
  }

  async savePreference(req: Request, res: Response) {
    try {
      await notificationService.saveOrUpdatePreference(req.body);
      res.status(200).json({ message: 'Category updated' });
    } catch (err) {
      res.status(500).json({ message: 'Error saving preference' });
    }
  }

  async getKeywords(req: Request, res: Response) {
    try {
      const data = await notificationService.getUserKeywords(req.params.userId);
      console.log(data);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching keywords' });
    }
  }

  async addKeyword(req: Request, res: Response) {
    const { userId, keyword } = req.body;
    try {
      await notificationService.addKeyword(userId, keyword);
      res.status(200).json({ message: 'Keyword added' });
    } catch (err) {
      res.status(500).json({ message: 'Error adding keyword' });
    }
  }
  async updateKeywordStatus(req: Request, res: Response) {
  const { userId, keyword, isEnabled } = req.body;

  try {
    const result = await notificationService.updateKeywordStatus(userId, keyword, isEnabled);
    res.status(200).json({ message: `Keyword ${isEnabled ? 'enabled' : 'disabled'}` });
  } catch (err) {
    res.status(500).json({ message: 'Error updating keyword status' });
  }
}

}
