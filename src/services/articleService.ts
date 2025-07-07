import { ArticleRepository } from '../repositories/articleRepository';
// const savedRepo = new ArticleRepository();

export class ArticleService {

  constructor(private savedRepo = new ArticleRepository()) {}
  async getSavedArticles(userId: string) {
    return this.savedRepo.getByUser(userId);
  }

  async saveArticle(article: any) {
    const exists = await this.savedRepo.checkExists(article.user_id, article.article_id);
    if (exists) throw { code: 'DUPLICATE' };
    return this.savedRepo.insert(article);
  }

  async deleteArticle(userId: string, articleId: string) {
    return this.savedRepo.remove(userId, articleId);
  }
}
