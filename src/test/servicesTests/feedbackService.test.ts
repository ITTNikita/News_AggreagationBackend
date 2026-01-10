import { FeedbackService } from '../../services/feedbackService';
import { FeedbackRepository } from '../../repositories/feedbackRepository';

jest.mock('../../repositories/feedbackRepository');
const MockRepo = FeedbackRepository as jest.MockedClass<typeof FeedbackRepository>;

const mockRepoInstance = {
  getFeedback: jest.fn(),
  insertFeedback: jest.fn(),
  updateFeedback: jest.fn(),
  reportArticle: jest.fn()
};

(MockRepo as any).mockImplementation(() => mockRepoInstance);

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FeedbackService();
  });

  describe('saveOrUpdateFeedback', () => {
    it('should insert feedback if none exists', async () => {
      mockRepoInstance.getFeedback.mockResolvedValue(null);

      await service.saveOrUpdateFeedback('1', '2', '1');

      expect(mockRepoInstance.insertFeedback).toHaveBeenCalledWith('1', '2', { like: '1', dislike: '0' });
    });

    it('should update feedback if it exists', async () => {
      mockRepoInstance.getFeedback.mockResolvedValue({ like: '1', dislike: '0' });

      await service.saveOrUpdateFeedback('1', '2', '0');

      expect(mockRepoInstance.updateFeedback).toHaveBeenCalledWith('1', '2', { like: '0', dislike: '1' });
    });
  });

  describe('reportArticle', () => {
    it('should call reportArticle from repository', async () => {
      mockRepoInstance.reportArticle.mockResolvedValue(undefined);
      const result = await service.reportArticle('1', '2');
      expect(mockRepoInstance.reportArticle).toHaveBeenCalledWith('1', '2');
      expect(result).toBeUndefined();
    });

    it('should handle errors in reportArticle', async () => {
      const mockError = new Error('Database failure');
      mockRepoInstance.reportArticle.mockRejectedValue(mockError);
      const result = await service.reportArticle('1', '2');
      expect(result).toBe(mockError);
    });
  });
});
