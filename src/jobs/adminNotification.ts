import { db } from '../config/db';
import { sendEmail } from '../utils/email';

export async function sendNotificationToAdmin(articleId: string, userId: string) {
  const getAdminQuery = `SELECT email FROM users WHERE role = 'admin' `;

  db.query(getAdminQuery, async (err, results: any[]) => {
    if (err || results.length === 0) {
      console.error('Admin not found or error occurred');
      return;
    }

    const adminEmail = results[0].email;

    const articleQuery = `SELECT id,title, description, url FROM articles WHERE id = ?`;
    db.query(articleQuery, [articleId], async (err, articles: any[]) => {
      if (err || articles.length === 0) {
        console.error('Article not found');
        return;
      }

      const article = articles[0];

      const emailBody = `
        <h2> Article Reported</h2>
        <p>User ID <strong>${userId}</strong> reported an article:</p>
        <p><strong>Article Id:${article.id}</strong></p>
        <strong>Title:</strong> ${article.title}<br/>
        <strong>Description:</strong> ${article.description}<br/>
        <a href="${article.url}" target="_blank">View Article</a><br/><br/>
        <p>You may review and choose to hide it from public view.</p>
      `;

   
      await sendEmail(adminEmail, `Article Reported by User ${userId}`, emailBody);

    
      

      console.log(`Admin notified about article ${articleId} reported by user ${userId}`);
    });
  });
}
