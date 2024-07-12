import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createSiteQueue from '../../../../../queue.mjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id, name: user.name }, process.env.JWT_SECRET as string, {
      expiresIn: '3d',
    });

    // 将任务添加到队列中
    createSiteQueue.add({
      siteName: `${name}-site`,
      userName: name,
      userId: user.id,
    });

    return NextResponse.json({ token, username: user.name });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
