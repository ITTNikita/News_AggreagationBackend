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
      article_id, title, description, source_name, url, category, dataKey
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
      server.dataKey
    ], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}


}