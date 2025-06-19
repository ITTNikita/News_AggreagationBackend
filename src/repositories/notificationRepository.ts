import { db } from '../config/db';

export class NotificationRepository {
  getUserNotifications(userId: string): Promise<any[]> {
    const query = `
       SELECT DISTINCT n.id, n.message, n.timestamp
    FROM notifications n     
    WHERE n.user_id = ?      
    ORDER BY n.timestamp DESC
    `;
    return new Promise((resolve, reject) => {
       db.query(query, [userId, userId, userId], (err, results) =>  {
        if (err) return reject(err);
      resolve(results as any[]);
      });
    });
  }

  saveOrUpdateCategory({ userId, category, isEnabled }: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const selectQuery = `SELECT * FROM notification_categories WHERE user_id = ? AND category = ?`;

      db.query(selectQuery, [userId, category], (selectErr, rows: any[]) => {
        if (selectErr) return reject(selectErr);

        if (rows.length > 0) {
          const updateQuery = `UPDATE notification_categories SET is_enabled = ? WHERE user_id = ? AND category = ?`;
          db.query(updateQuery, [isEnabled, userId, category], (updateErr) => {
            if (updateErr) return reject(updateErr);
            resolve();
          });
        } else {
          const insertQuery = `INSERT INTO notification_categories (user_id, category, is_enabled) VALUES (?, ?, ?)`;
          db.query(insertQuery, [userId, category, isEnabled], (insertErr) => {
            if (insertErr) return reject(insertErr);
            resolve();
          });
        }
      });
    });
  }

 
async getUserKeywords(userId: string): Promise<any[]> {
  console.log("routes",userId)
  const query = `SELECT keyword, is_enabled FROM user_keywords WHERE user_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error(" Error fetching keywords:", err);
        return reject(err);
      }
      console.log(results);
      resolve(results as any[]);
    });
  });
}


async addKeyword(userId: string, keyword: string): Promise<void> {

  const query = `INSERT INTO user_keywords (user_id, keyword, is_enabled)
                 VALUES (?, ?, 1)
                 ON DUPLICATE KEY UPDATE is_enabled = 1`;
   db.query(query, [userId, keyword]);
}

async updateKeywordStatus(userId: string, keyword: string, isEnabled: boolean): Promise<boolean> {
  const query = `UPDATE user_keywords SET is_enabled = ? WHERE user_id = ? AND keyword = ?`;

  return new Promise((resolve, reject) => {
    db.query(query, [isEnabled, userId, keyword], (err, result) => {
      if (err) {
        console.error('Error updating keyword status:', err);
        return reject(err);
      }
      resolve((result as any).affectedRows > 0);
    });
  });
}

}
