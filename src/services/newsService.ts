import { NewsRepository } from '../repositories/newsRepository';
const newsRepo = new NewsRepository();

export class NewsService {
  constructor(private newsRepo = new NewsRepository()) {}
  async fetchTodayArticles() {
    return this.newsRepo.getTodayArticles();
  }

  async fetchFilteredArticles(from: string, to: string, category: string) {
    return this.newsRepo.getArticlesByCategory(from, to, category);
  }

  async fetchAllArticles(from: string, to: string) {
    return this.newsRepo.getAllArticles(from, to);
  }

  async fetchUserPreferenceArticles(userId:string)
  {
    return this.newsRepo.getPersonalizedArticles(userId);
  }
}