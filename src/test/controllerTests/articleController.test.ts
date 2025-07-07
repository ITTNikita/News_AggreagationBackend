import { ArticleService } from '../../services/articleService';
import { ArticleController } from '../../controllers/articleController';

jest.mock('../../services/articleService');
const MockArticleService = ArticleService as jest.MockedClass<typeof ArticleService>;

const mockServiceInstance = {
  getSavedArticles: jest.fn(),
  saveArticle: jest.fn(),
  deleteArticle: jest.fn()
};

(MockArticleService as any).mockImplementation(() => mockServiceInstance);

describe('ArticleController', () => {
  const controller = new ArticleController();

  const mockReq: any = {};
  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return saved articles', async () => {
    mockReq.query = { userId: '1' };

    const mockArticle = {
      article_id: '123',
      title: 'Test Title',
      description: 'A sample description',
      source_name: 'Sample Source',
      url: 'http://example.com',
      category: 'Tech',
      saved_at: '2023-01-01T10:00:00Z',
    };

    mockServiceInstance.getSavedArticles.mockResolvedValue([mockArticle]);

    await controller.getSavedArticles(mockReq, mockRes);

    const expectedFormatted = [{
      id: 1,
      article_id: mockArticle.article_id,
      title: mockArticle.title,
      description: mockArticle.description,
      source_name: mockArticle.source_name,
      url: mockArticle.url,
      category: mockArticle.category,
      saved_at: new Date(mockArticle.saved_at).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }];

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expectedFormatted);
  });

  it('should handle error when getting articles', async () => {
    mockReq.query = { userId: '1' };
    mockServiceInstance.getSavedArticles.mockRejectedValue(new Error('fail'));
    await controller.getSavedArticles(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to fetch saved articles' });
  });

  it('should save article', async () => {
    mockReq.body = { user_id: '1', article_id: '2' };
    await controller.saveArticle(mockReq, mockRes);
    expect(mockServiceInstance.saveArticle).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: ' Article saved successfully.' });
  });

  it('should return 409 if duplicate save', async () => {
    mockReq.body = { user_id: '1', article_id: '2' };
    mockServiceInstance.saveArticle.mockRejectedValue({ code: 'DUPLICATE' });
    await controller.saveArticle(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({ message: ' Article already saved.' });
  });

  it('should handle error in save', async () => {
    mockReq.body = { user_id: '1', article_id: '2' };
    mockServiceInstance.saveArticle.mockRejectedValue(new Error('fail'));
    await controller.saveArticle(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to save article.' });
  });

  it('should delete article', async () => {
    mockReq.params = { userId: '1', articleId: '2' };
    await controller.deleteArticle(mockReq, mockRes);
    expect(mockServiceInstance.deleteArticle).toHaveBeenCalledWith('1', '2');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: ' Article deleted successfully.' });
  });

  it('should handle error on delete', async () => {
    mockReq.params = { userId: '1', articleId: '2' };
    mockServiceInstance.deleteArticle.mockRejectedValue(new Error('fail'));
    await controller.deleteArticle(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to delete article.' });
  });
});
