import { db } from '../config/db';

export class AdminRepository {
  static async hideArticleGlobally(articleId: string): Promise<void>{
  const query = `UPDATE articles SET is_hidden = 1 WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [articleId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  static async hideCategory(categoryName: string):Promise<void>{
    const query = `UPDATE articles SET is_hidden = 1 WHERE category = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [categoryName.toLowerCase()], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

static async filterArticlesByKeyword(keyword: string) : Promise<void>{
console.log("keyword serach and reporting the article according to the keyword")
   const query = `
      UPDATE articles 
      SET is_hidden = 1 
      WHERE 
        LOWER(title) LIKE ? OR 
        LOWER(description) LIKE ? OR 
        LOWER(content) LIKE ?
    `;

    const keywordPattern = `%${keyword.toLowerCase()}%`;

    return new Promise((resolve, reject) => {
      db.query(query, [keywordPattern, keywordPattern, keywordPattern], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}



