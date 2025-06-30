import { db } from '../config/db';
import { ExternalServerInput } from '../models/ExternalServerInput.model';

export class ExternalServerRepository {
  fetchStatus(): Promise<any[]> {
    const query = 'SELECT name, is_active, last_accessed FROM externalServer';
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results as any[]);
      });
    });
  }

  fetchDetails(): Promise<any[]> {
    const query = 'SELECT * FROM externalServer ';
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results as any[]);
      });
    });
  }

  updateApiKey(id: number, api_key: string): Promise<boolean> {
    const query = 'UPDATE externalServer SET api_key = ?, updated_at = NOW() WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [api_key, id], (err, result) => {
        if (err) return reject(err);
        resolve((result as any).affectedRows > 0);
      });
    });
  }

  addServer(server: ExternalServerInput): Promise<void> {
    const query = `
      INSERT INTO externalServer (
        name, api_url, api_key, is_active, last_accessed,
        article_id, title, description, source_name, url, category, dataKey, content
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [
        server.name,
        server.apiurl,
        server.key,
        server.isActive,
        new Date(), 
        server.article_id,
        server.title,
        server.description,
        server.source_name,
        server.url,
        server.category,
        server.content,
        server.dataKey
      ], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  categoryExists(category: string): Promise<boolean> {
    const checkQuery = `SELECT COUNT(*) AS count FROM category WHERE category = ?`;

    return new Promise((resolve, reject) => {
      db.query(checkQuery, [category], (err, results) => {
        if (err) return reject(err);

        const typedResults = results as { count: number }[]; 
        resolve(typedResults[0].count > 0);
      });
    });
  }

  async addCategory(category: string): Promise<string> {
    const exists = await this.categoryExists(category);
    if (exists) {
       return "Category already exists";
    }
    const insertQuery = `INSERT INTO category (category) VALUES (?)`;
    return new Promise((resolve, reject) => {
      db.query(insertQuery, [category], (err) => {
        if (err) return reject(err);
        resolve("Category added successfully");
      });
    });
  }

  getAllCategories(): Promise<any> {    
    const selectQuery = `select * from category`;
    return new Promise((resolve, reject) => {
      db.query(selectQuery, (err,result) => {
        if (err) return reject(err);
        resolve(result as any);
      });
      });
  }
}


