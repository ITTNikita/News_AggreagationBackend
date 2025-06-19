import { db } from '../config/db';

export class SearchRepository {
  fullTextSearch(query: string, from?: string, to?: string): Promise<any[]> {
    let sql = `
      SELECT * FROM articles
      WHERE (title LIKE ? OR description LIKE ?)
    `;
    const params: any[] = [`%${query}%`, `%${query}%`];

    if (from && to) {
      sql += ' AND DATE(published_at) BETWEEN ? AND ?';
      params.push(from, to);
    }

    sql += ' ORDER BY published_at DESC';

    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) return reject(err);
      resolve(results as any[]);
      });
    });
  }
}
