import { db } from '../config/db';

export class UserRepository {
  findByEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results: any[]) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

 findByUserName(username: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results: any[]) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
}


  create(username: string, email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, password], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
