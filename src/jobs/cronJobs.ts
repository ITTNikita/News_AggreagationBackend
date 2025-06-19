import cron from 'node-cron';
import { sendAllNotifications } from './notificationJob';
import { fetchNewsArticles } from './newsFetcherJob';

export function startCronJobs() {
  cron.schedule('0 */4 * * *', async () => {
    console.log("articles");
     await fetchNewsArticles();    
  });
  cron.schedule('0 */4 * * *', async () => {
    await sendAllNotifications();
  });
}