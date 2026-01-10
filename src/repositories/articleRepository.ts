import { db } from '../config/db';

export class ArticleRepository {
  getByUser(userId: string): Promise<any[]> {
    const query = `
      SELECT article_id, title, description, source_name, url, category, saved_at
      FROM savedArticles
      WHERE user_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results as any[]);
      });
    });
  }

  checkExists(userId: string, articleId: string): Promise<boolean> {
    const query = `SELECT * FROM savedArticles WHERE user_id = ? AND article_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, articleId], (err, results: any[]) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      });
    });
  }

  insert(article: any): Promise<void> {
    const query = `
      INSERT INTO savedArticles (user_id, article_id, title, description, source_name, url, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [article.user_id, article.article_id, article.title, article.description, article.source_name, article.url, article.category], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  remove(userId: string, articleId: string): Promise<void> {
    const query = `DELETE FROM savedArticles WHERE user_id = ? AND article_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, articleId], (err, result) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}