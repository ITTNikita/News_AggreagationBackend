import { AdminRepository } from '../repositories/adminRepository';

export class AdminService {
  static async hideArticleGlobally(articleId: string) {
    await AdminRepository.hideArticleGlobally(articleId);
  }

  static async hideCategory(categoryName: string) {
    await AdminRepository.hideCategory(categoryName);
  }

  static async filterArticlesByKeyword(keyword: string) {
    await AdminRepository.filterArticlesByKeyword(keyword);
  }

  
}
