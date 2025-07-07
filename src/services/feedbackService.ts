import { FeedbackRepository } from "../repositories/feedbackRepository";

export class FeedbackService {
  constructor(private feedbackRepo: FeedbackRepository = new FeedbackRepository()) {}

  async saveOrUpdateFeedback(userId: string, articleId: string, userChoice: string) {
    const feedback = await this.feedbackRepo.getFeedback(userId, articleId);

    const update = {
      like: userChoice === '1' ? '1' : '0',
      dislike: userChoice === '0' ? '1' : '0',
    };

    if (feedback) {
      return await this.feedbackRepo.updateFeedback(userId, articleId, update);
    } else {
      return await this.feedbackRepo.insertFeedback(userId, articleId, update);
    }
  }

  async reportArticle(userId: string, articleId: string) {
    try {
      return await this.feedbackRepo.reportArticle(userId, articleId); 
    } catch (error) {
      console.error("Error reporting article:", error);
      return error;
    }
  }
}
