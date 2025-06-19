import { transporter } from '../config/email';

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ID,
      to,
      subject,
      html,
    });
    console.log(` Email sent to ${to}`);
  } catch (err) {
    console.error(' Failed to send email:', err);
  }
}