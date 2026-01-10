import { ArticleService } from '../../services/articleService';
import { ArticleRepository } from '../../repositories/articleRepository';

jest.mock('../../repositories/articleRepository');
const MockArticleRepo = ArticleRepository as jest.MockedClass<typeof ArticleRepository>;

const mockRepoInstance = {
  getByUser: jest.fn(),
  checkExists: jest.fn(),
  insert: jest.fn(),
  remove: jest.fn()
};

(MockArticleRepo as any).mockImplementation(() => mockRepoInstance);

describe('ArticleService', () => {
  let service: ArticleService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ArticleService();
  });

  it('should return saved articles for a user', async () => {
    const articles = [{ article_id: '2', title: 'Test' }];
    mockRepoInstance.getByUser.mockResolvedValue(articles);
    const result = await service.getSavedArticles('1');
    expect(result).toEqual(articles);
    expect(mockRepoInstance.getByUser).toHaveBeenCalledWith('1');
  });

  it('should insert article if it does not exist', async () => {
    const article = { user_id: '1', article_id: '2', title: 'Test' };
    mockRepoInstance.checkExists.mockResolvedValue(false);
    await service.saveArticle(article);
    expect(mockRepoInstance.insert).toHaveBeenCalledWith(article);
  });

  it('should throw DUPLICATE if article already exists', async () => {
    const article = { user_id: '1', article_id: '2', title: 'Test' };
    mockRepoInstance.checkExists.mockResolvedValue(true);
    await expect(service.saveArticle(article)).rejects.toEqual({ code: 'DUPLICATE' });
  });

  it('should delete saved article', async () => {
    await service.deleteArticle('1', '2');
    expect(mockRepoInstance.remove).toHaveBeenCalledWith('1', '2');
  });
});