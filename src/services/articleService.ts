import { ArticleRepository } from '../repositories/articleRepository';
const savedRepo = new ArticleRepository();

export class ArticleService {
  getSavedArticles(userId: string) {
    return savedRepo.getByUser(userId);
  }

  async saveArticle(article: any) {
    const exists = await savedRepo.checkExists(article.user_id, article.article_id);
    if (exists) throw { code: 'DUPLICATE' };
    return savedRepo.insert(article);
  }

  deleteArticle(userId: string, articleId: string) {
    return savedRepo.remove(userId, articleId);
  }
}
