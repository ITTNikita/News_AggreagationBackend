import { db } from '../config/db';

export class NewsRepository {
  getTodayArticles(): Promise<any[]> {
    const query = `SELECT * FROM articles WHERE DATE(created_at) = CURDATE() and is_hidden = 0`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results as any[]);
      });
    });
  }

  getArticlesByCategory(from: string, to: string, category: string): Promise<any[]> {
    const query = `
      SELECT id, title, description, url, published_at, source_name, category
      FROM articles
      WHERE DATE(published_at) BETWEEN ? AND ? AND category = ? AND is_hidden = 0
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
     let query = `
       SELECT 
        a.*,
        COALESCE(SUM(ld.likes), 0) AS like_count,
        COALESCE(SUM(ld.dislike), 0) AS dislike_count
      FROM 
        articles a
      LEFT JOIN article_feedback ld ON a.id = ld.articleid where is_hidden = 0
    `;
     const params: any[] = [];

    if (from && to) {
      query += ' AND DATE(published_at) BETWEEN ? AND ?';
      params.push(from, to);
    }

    query += ' GROUP BY  a.id ORDER BY like_count DESC, dislike_count ASC';
    return new Promise((resolve, reject) => {
      db.query(query, [from, to], (err, results) => {
        if (err) return reject(err);
        resolve(results as any[]);
      });
    });
  }

async getUserPreferences(userId: string): Promise<{ keywords: string[], categories: string[] }> {
  console.log("Fetching user preferences...");

  return new Promise((resolve, reject) => {
    const keywordQuery = `SELECT keyword FROM user_keywords WHERE user_id = ? AND is_enabled = 1`;
    const likedCategoryQuery = `
      SELECT DISTINCT a.category 
      FROM article_feedback af
      JOIN articles a ON af.articleId = a.id
      WHERE af.userId = ? AND af.likes = 1
    `;
    const notificationCategoryQuery = `SELECT category FROM notification_categories WHERE user_id = ? AND is_enabled = 1`;
    const savedArticleCategoryQuery = `
      SELECT DISTINCT a.category
      FROM savedarticles sa
      JOIN articles a ON sa.article_id = a.id
      WHERE sa.user_id = ?
    `;

    db.query(keywordQuery, [userId], (err1, keywords) => {
      if (err1) {
        console.error('Error fetching keywords:', err1);
        return reject(new Error('Failed to fetch user keywords.'));
      }

      db.query(likedCategoryQuery, [userId], (err2, likedCategories) => {
        if (err2) {
          console.error('Error fetching liked article categories:', err2);
          return reject(new Error('Failed to fetch liked article categories.'));
        }

        db.query(notificationCategoryQuery, [userId], (err3, notifCategories) => {
          if (err3) {
            console.error('Error fetching notification categories:', err3);
            return reject(new Error('Failed to fetch notification categories.'));
          }

          db.query(savedArticleCategoryQuery, [userId], (err4, savedCategories) => {
            if (err4) {
              console.error('Error fetching saved article categories:', err4);
              return reject(new Error('Failed to fetch saved article categories.'));
            }

            try {
              const allKeywords = (Array.isArray(keywords) ? keywords : []).map((row: any) => row.keyword.toLowerCase());
              const allCategories = [
                ...(Array.isArray(likedCategories) ? likedCategories : []),
                ...(Array.isArray(notifCategories) ? notifCategories : []),
                ...(Array.isArray(savedCategories) ? savedCategories : []),
              ].map((row: any) => row.category.toLowerCase());

              const uniqueKeywords = Array.from(new Set(allKeywords));
              const uniqueCategories = Array.from(new Set(allCategories));

              resolve({ keywords: uniqueKeywords, categories: uniqueCategories });
            } catch (processingError) {
              console.error('Error processing user preferences:', processingError);
              reject(new Error('Failed to process user preferences.'));
            }
          });
        });
      });
    });
  });
}


async  getPersonalizedArticles(userId: string): Promise<any[]> {
  const preferences = await this.getUserPreferences(userId);
  preferences.categories = preferences.categories.filter(cat => cat !== 'general');
  const todayArticles = await this.getTodayArticles(); 
  const personalized = todayArticles.filter((article: any) => {
  const articleText = `${article.title} ${article.description} ${article.content}`.toLowerCase();
  const articleCategory = article.category.toLowerCase();
  const keywordMatch = preferences.keywords.some(keyword => articleText.includes(keyword.trim()));
  const categoryMatch = preferences.categories.includes(articleCategory);
  console.log(keywordMatch , categoryMatch);
  return keywordMatch || categoryMatch;
  });
  return personalized;
  }
}