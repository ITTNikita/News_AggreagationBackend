import { NewsRepository } from '../repositories/newsRepository';
const newsRepo = new NewsRepository();

export class NewsService {
  async fetchTodayArticles() {
    return newsRepo.getTodayArticles();
  }

  async fetchFilteredArticles(from: string, to: string, category: string) {
    return newsRepo.getArticlesByCategory(from, to, category);
  }

  async fetchAllArticles(from: string, to: string) {
    return newsRepo.getAllArticles(from, to);
  }
}