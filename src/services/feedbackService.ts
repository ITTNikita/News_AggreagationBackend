
import { FeedbackRepository } from "../repositories/feedbackRepository";
const feedbackRepo = new FeedbackRepository();
 
export class FeedbackService {
  async saveOrUpdateFeedback(userId: string, articleId: string, userChoice: string) {
    const feedback = await feedbackRepo.getFeedback(userId, articleId);
  
    const update = {
      like: userChoice === '1' ? '1' : '0',
      dislike: userChoice === '0' ? '1' : '0',
    };
    console.log(userId,articleId,update) 
    if (feedback) {
      return await feedbackRepo.updateFeedback(userId, articleId, update);
    } else {
      return await feedbackRepo.insertFeedback(userId, articleId, update);
    }
  }
  async reportArticle(userId: string, articleId:string)
  {
    try{
      return await feedbackRepo.reportArticle( articleId,userId);
    }catch(error)
    {
      console.log("error",error)
      return error;
    }
  }
}