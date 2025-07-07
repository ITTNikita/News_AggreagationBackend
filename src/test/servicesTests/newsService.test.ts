import { NewsService } from '../../services/newsService';
import { NewsRepository } from '../../repositories/newsRepository';

jest.mock('../../repositories/newsRepository');
const MockRepo = NewsRepository as jest.MockedClass<typeof NewsRepository>;

// Mock repo methods
const mockRepoInstance = {
  getTodayArticles: jest.fn(),
  getArticlesByCategory: jest.fn(),
  getAllArticles: jest.fn(),
  getUserPreferences: jest.fn(), 
  getPersonalizedArticles: jest.fn()
};

(MockRepo as any).mockImplementation(() => mockRepoInstance);

describe('NewsService', () => {
  let service: NewsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NewsService(); 
  });

  it('should fetch today articles', async () => {
    mockRepoInstance.getTodayArticles.mockResolvedValue(['a']);
    const res = await service.fetchTodayArticles();
    expect(res).toEqual(['a']);
  });

  it('should fetch articles by filter', async () => {
    mockRepoInstance.getArticlesByCategory.mockResolvedValue(['b']);
    const res = await service.fetchFilteredArticles('2024-01-01', '2024-01-31', 'Tech');
    expect(res).toEqual(['b']);
  });

  it('should fetch all articles', async () => {
    mockRepoInstance.getAllArticles.mockResolvedValue(['c']);
    const res = await service.fetchAllArticles('2024-01-01', '2024-01-31');
    expect(res).toEqual(['c']);
  });

  it('should fetch user preference articles', async () => {
    mockRepoInstance.getPersonalizedArticles.mockResolvedValue(['p']);
    const res = await service.fetchUserPreferenceArticles('1');
    expect(res).toEqual(['p']);
  });
});
