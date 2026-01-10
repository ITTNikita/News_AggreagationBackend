import { FeedBackController } from '../../controllers/feedbackController';
import { FeedbackService } from '../../services/feedbackService';

describe('FeedBackController', () => {
  const controller = new FeedBackController();

  const mockReq: any = {};
  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  let saveOrUpdateFeedbackSpy: jest.SpyInstance;
  let reportArticleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    saveOrUpdateFeedbackSpy = jest.spyOn(FeedbackService.prototype, 'saveOrUpdateFeedback').mockResolvedValue(undefined);
    reportArticleSpy = jest.spyOn(FeedbackService.prototype, 'reportArticle').mockResolvedValue(undefined);
  });

  describe('setFeedback', () => {
    it('should reject invalid userChoice', async () => {
      mockReq.body = { userId: '1', articleId: '2', userChoice: 'invalid' };
      await controller.setFeedback(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Value must be 0 (dislike) or 1 (like)' });
    });

    it('should save valid feedback', async () => {
      mockReq.body = { userId: '1', articleId: '2', userChoice: '1' };
      await controller.setFeedback(mockReq, mockRes);
      expect(saveOrUpdateFeedbackSpy).toHaveBeenCalledWith('1', '2', '1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Feedback saved successfully' });
    });

    it('should return 500 on service error', async () => {
      saveOrUpdateFeedbackSpy.mockRejectedValue(new Error('fail'));
      mockReq.body = { userId: '1', articleId: '2', userChoice: '1' };
      await controller.setFeedback(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to save feedback' });
    });
  });

  describe('reportArticle', () => {
    it('should return 400 if missing params', async () => {
      mockReq.body = { params: {} };
      await controller.reportArticle(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'there is some error in userId or article id' });
    });

    it('should call reportArticle when valid', async () => {
      mockReq.body = { params: { userId: '1', articleId: '2' } };
      await controller.reportArticle(mockReq, mockRes);
      expect(reportArticleSpy).toHaveBeenCalledWith('1', '2');
    });

    it('should handle errors in reportArticle gracefully', async () => {
      reportArticleSpy.mockRejectedValue(new Error('fail'));
      mockReq.body = { params: { userId: '1', articleId: '2' } };
      await controller.reportArticle(mockReq, mockRes);
    });
  });
});
