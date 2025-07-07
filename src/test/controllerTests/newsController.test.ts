import { NewsController } from '../../controllers/newsController';
import { NewsService } from '../../services/newsService';

jest.mock('../../services/newsService');
const MockNewsService = NewsService as jest.MockedClass<typeof NewsService>;

const mockServiceInstance = {
  fetchTodayArticles: jest.fn(),
  fetchUserPreferenceArticles: jest.fn(),
  fetchFilteredArticles: jest.fn(),
  fetchAllArticles: jest.fn()
};

(MockNewsService as any).mockImplementation(() => mockServiceInstance);

describe('NewsController', () => {
  const controller = new NewsController();
  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return today's articles", async () => {
    const mockReq: any = {};
    mockServiceInstance.fetchTodayArticles.mockResolvedValue(['article1']);
    await controller.getTodayArticles(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(['article1']);
  });

  it("should handle error in fetching today's articles", async () => {
    const mockReq: any = {};
    mockServiceInstance.fetchTodayArticles.mockRejectedValue(new Error());
    await controller.getTodayArticles(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to fetch today\'s articles' });
  });

  it('should fetch user preference articles', async () => {
    const mockReq: any = { query: { id: 'user1' } };
    mockServiceInstance.fetchUserPreferenceArticles.mockResolvedValue(['article2']);
    await controller.getUserPreferenceArticles(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(['article2']);
  });

  it('should return 400 for invalid userId in getUserPreferenceArticles', async () => {
    const mockReq: any = { query: {} };
    await controller.getUserPreferenceArticles(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid or missing userId' });
  });

  it('should return articles by filter', async () => {
    const mockReq: any = { query: { from: '2024-01-01', to: '2024-01-31', category: 'Tech' } };
    mockServiceInstance.fetchFilteredArticles.mockResolvedValue(['article3']);
    await controller.getArticlesByFilter(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(['article3']);
  });

  it('should return all articles by date range', async () => {
    const mockReq: any = { query: { from: '2024-01-01', to: '2024-01-31' } };
    mockServiceInstance.fetchAllArticles.mockResolvedValue(['article4']);
    await controller.getAllArticles(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(['article4']);
  });
});
