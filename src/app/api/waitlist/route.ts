import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    // secureConnection: true,
    // secure: true, // 使用 SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // 发送到你的邮箱
    subject: 'New Waitlist Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
