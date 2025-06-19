import axios from 'axios';
import { db } from '../config/db';

export async function fetchNewsArticles() {
  const getActiveServersQuery = `SELECT * FROM externalServer WHERE is_active = 1`;

  db.query(getActiveServersQuery, async (err, activeServers: any[]) => {
    if (err || !activeServers || activeServers.length === 0) return;

    const deleteOldArticlesQuery = `TRUNCATE TABLE articles`;
    db.query(deleteOldArticlesQuery, async (deleteErr) => {
      if (deleteErr) return;

      for (const server of activeServers) {
        const apiUrl = `${server.api_url}&${server.api_key}`;
        console.log("test",apiUrl);

        try {
          const res = await axios.get(apiUrl);
          const articles = res.data[server.dataKey] || [];

          const insertQuery = `
            INSERT INTO articles (title, description, url, published_at, category, source_name)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          for (const article of articles) {
             const title = server.title.split('.').reduce((acc:any, key:string) => (acc && acc[key] !== undefined) ? acc[key] : '', article) || '';
            const description = server.description.split('.').reduce((acc:any, key:string) => (acc && acc[key] !== undefined) ? acc[key] : '', article) || '';
            const url = server.url.split('.').reduce((acc:any, key:string) => (acc && acc[key] !== undefined) ? acc[key] : '', article) || '';
            const source_name=server.source_name.split('.').reduce((acc:any, key:string) => (acc && acc[key] !== undefined) ? acc[key] : '', article);
            const publishedAt = server.published_at.split('.').reduce((acc:any, key:string) => (acc && acc[key] !== undefined) ? acc[key] : '', article);
           

            console.log(title,'t');
            console.log(url,'url');
            console.log(source_name,'s');

            let category = article[server.category] || '';
           
            console.log("")

            if (!title || !url || !source_name) continue;
            console.log("nikita", title);
            if (!category) {
              const text = `${title} ${description}`.toLowerCase();
              if (text.includes('business')) category = 'Business';
              else if (text.includes('sports')) category = 'Sports';
              else if (text.includes('entertainment')) category = 'Entertainment';
              else if (text.includes('technology')) category = 'Technology';
              else category = 'General';
            }
            console.log("hello");

            const formattedDateOnly = publishedAt
              ? new Date(publishedAt).toISOString().slice(0, 10)
              : new Date().toISOString().slice(0, 10);
console.log("formated",formattedDateOnly)
            db.query(
              insertQuery,
              [title, description || '', url, formattedDateOnly, category, source_name],
              (insertErr) => {
                if (insertErr) {
                  console.error(` Error inserting article: ${title}`, insertErr.message);
                }
              }
            );
          }

          console.log(`Stored ${articles.length} articles from ${server.name}`);
        } catch (error: any) {
          console.error(` Error fetching from ${server.name}: ${error.message}`);
        }
      }
    });
  });
}