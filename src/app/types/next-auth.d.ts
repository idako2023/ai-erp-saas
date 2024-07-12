// src/types/next-auth.d.ts
import { NextApiRequest } from 'next';

declare module 'next' {
  interface NextApiRequest {
    user?: {
      userId: number;
    };
  }
}
