import { resolve } from 'path';
import { db } from '../config/db';
import { rejects } from 'assert';
import { sendNotificationToAdmin } from '../jobs/adminNotification';
import { RowDataPacket } from 'mysql2';
 
export class FeedbackRepository {
  async getAllReportedArticles(articleId:string):Promise<any>{
    return new Promise((resolve,reject)=>{
      db.query(`SELECT * FROM Articles where id = ? and  is_reported = 1`,[articleId],(err,results:any[])=>{
         if (err) return reject(err);
          resolve(results && results.length > 0 ? results[0] : null);
      });
    });
  }

  async getFeedback(userId: string, articleId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM Article_Feedback WHERE userId = ? AND articleId = ?`,
        [userId, articleId],
        (err, results: any[]) => {
          if (err) return reject(err);
          resolve(results && results.length > 0 ? results[0] : null);
        }
      );
    });
  }
 
  async insertFeedback(userId: string, articleId: string, feedback: { like: string; dislike: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      db.query(
      `INSERT INTO Article_Feedback (userId, articleId, likes, dislike) VALUES (?, ?, ?, ?)`,[userId, articleId, feedback.like, feedback.dislike],
      (err) => {
      if (err) {
       console.error("Failed to insert feedback into Article_Feedback:", err);
       return reject(new Error("Database error: Could not insert feedback."));
    }
    resolve();
    });
  });
  }
 
  async updateFeedback(userId: string, articleId: string, feedback: { like: string; dislike: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE Article_Feedback SET likes = ?, dislike = ? WHERE userId = ? AND articleId = ?`,
        [feedback.like, feedback.dislike, userId, articleId],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  async reportArticle(articleId: string,userId:string): Promise<void>
  {
    sendNotificationToAdmin(articleId,userId);
    console.log("sending email to admin regarding article reporting")
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE Articles SET is_reported = is_reported+1 WHERE  id = ?`,
        [articleId],
        (err) => {
          if (err) return reject(err);
          this.checkAndHideArticleIfThresholdExceeded(articleId)
            .then(() => resolve())
            .catch(reject);
        }
      );
    });
  }


  private async checkAndHideArticleIfThresholdExceeded(articleId: string): Promise<void> {
  const threshold = 2;
  const query = `SELECT is_reported FROM Articles WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [articleId], (err, results) => {
      if (err) return reject(err);

      const rows = results as RowDataPacket[];
      const reportedCount = rows[0]?.is_reported || 0;

      if (reportedCount >= threshold) {
        const hideQuery = `UPDATE Articles SET is_hidden = 1 WHERE id = ?`;
        db.query(hideQuery, [articleId], (err) => {
          if (err) return reject(err);
          console.log(`Article ${articleId} auto-hidden after reaching ${reportedCount} reports.`);
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
  }

}