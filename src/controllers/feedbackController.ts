import { Request, Response } from 'express';
import { FeedbackService } from '../services/feedbackService';
 
const feedbackService = new FeedbackService();
 
export class FeedBackController {
   async setFeedback(req: Request, res: Response) {      
    try {      
      const { userId, articleId, userChoice } = req.body;
      if (userChoice !=='0' && userChoice !=='1') {
        res.status(400).json({ message: 'Value must be 0 (dislike) or 1 (like)' });
        return;
      } 
      await feedbackService.saveOrUpdateFeedback(userId, articleId, userChoice);
      res.status(200).json({ message: 'Feedback saved successfully' });
      return;
    } catch (err) {
      console.error(' Error saving feedback:', err);
      res.status(500).json({ message: 'Failed to save feedback' });
      return;
    }
  }
  async reportArticle(req: Request,res: Response)
  {
    try{
    const {userId,articleId}= req.body.params; 
    if(!userId || !articleId)
    {
      res.status(400).json({ message: 'there is some error in userId or article id' });
      return;
    }
    await feedbackService.reportArticle(userId,articleId);
    return ;
    }
    catch(error)
    {
      console.log(error);
    }
  }
}