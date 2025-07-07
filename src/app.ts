
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes';
import { connectToDB } from './config/db';
import { startCronJobs } from './jobs/cronJobs';
import { fetchNewsArticles } from './jobs/newsFetcherJob';
import { sendAllNotifications } from './jobs/notificationJob';
import { logMessage } from '../logs/logService';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

connectToDB();
logMessage('database connection established');
// startCronJobs();
logMessage('Cron jobs started');
fetchNewsArticles();
sendAllNotifications();
app.use('/api', routes);
logMessage('Routes initialized');

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});


