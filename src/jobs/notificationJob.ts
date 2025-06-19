import axios from 'axios';
import { db } from '../config/db';
import { sendEmail } from '../utils/email';

export async function sendAllNotifications() {
  const getUsersQuery = `SELECT id, email FROM users`;
  const getActiveServersQuery = `SELECT * FROM externalServer WHERE is_active = 1`;

  db.query(getActiveServersQuery, async (err, activeServers: any[]) => {
    if (err || activeServers.length === 0) return;

    db.query(getUsersQuery, async (err, users: any[]) => {
      if (err || users.length === 0) return;

      for (const user of users) {
        const userId = user.id;
        const userEmail = user.email;

        const categoryQuery = `
          SELECT category 
          FROM notification_categories 
          WHERE user_id = ? AND is_enabled = 1
          UNION 
          SELECT Keyword as category from user_keywords where user_id=? and is_enabled=1
        `;
        db.query(categoryQuery, [userId, userId], async (catErr, categories: any[]) => {
          if (catErr || categories.length === 0) return;
          let emailBody = `<h2> Your Daily News Digest</h2>`;
          let hasArticles = false;
          for (const row of categories) {
            const category = row.category.toLowerCase();

            for (const server of activeServers) {
              let apiUrl = server.api_url;
              const apiKey = server.api_key;
              apiUrl = `${apiUrl}?q=${category}&${apiKey}`;
              console.log(apiUrl);

              try {
                const res = await axios.get(apiUrl);
                const articles = res.data[server.dataKey];                

                if (articles && articles.length > 0) {
                  hasArticles = true;
                  emailBody += `<h3>${category.toUpperCase()} (${server.name})</h3><ul>`;

                  articles.forEach((article: any) => {
                    const title = server.title.split('.').reduce((acc:any, key:string) => (acc && acc[key] !== undefined) ? acc[key] : '', article) || '';
                    const description = server.description.split('.').reduce((acc:any, key:string) => (acc && acc[key] !== undefined) ? acc[key] : '', article) || '';
                    const url = server.url.split('.').reduce((acc:any, key:string) => (acc && acc[key] !== undefined) ? acc[key] : '', article) || '';                    
                    emailBody += `
                      <li>
                        <strong>${title}</strong><br/>
                        ${description || ''}<br/>
                        <a href="${url}" target="_blank">Read more</a>
                      </li><br/>
                    `;
                  });

                  emailBody += `</ul><hr/>`;
                }
              } catch (error: any) {
                console.error(`Error fetching from ${server.name} for category ${category}: ${error.message}`);
              }
            }
          }

          if (hasArticles) {
            await sendEmail(
              userEmail,
              'Your Category-Based News Notification',
              emailBody
            );

            const categoryNames = categories.map((c: any) => c.category).join(', ');
            const notificationQuery = `INSERT INTO notifications (user_id, message, timestamp) VALUES (?, ?, NOW())`;
            db.query(notificationQuery, [userId, `New articles in your subscribed categories: ${categoryNames}`]);
          }
        });
      }
    });
  });
}