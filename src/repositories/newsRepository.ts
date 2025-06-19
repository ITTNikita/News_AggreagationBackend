import { db } from '../config/db';

export class NewsRepository {
  getTodayArticles(): Promise<any[]> {
    console.log('Fetching today\'s articles testing');
    const query = `SELECT * FROM articles WHERE DATE(created_at) = CURDATE()`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err);
        console.log('results', results);
        resolve(results as any[]);
      });
    });
  }

  getArticlesByCategory(from: string, to: string, category: string): Promise<any[]> {
    const query = `
      SELECT id, title, description, url, published_at, source_name, category
      FROM articles
      WHERE DATE(published_at) BETWEEN ? AND ? AND category = ?
      ORDER BY published_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [from, to, category], (err, results) => {
        if (err) return reject(err);
        resolve(results as any[]);
      });
    });
  }

  getAllArticles(from: string, to: string): Promise<any[]> {
    const query = `
      SELECT id, title, description, url, published_at, source_name, category
      FROM articles
      WHERE DATE(published_at) BETWEEN ? AND ?
      ORDER BY published_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [from, to], (err, results) => {
        if (err) return reject(err);
        resolve(results as any[]);
      });
    });
  }
}