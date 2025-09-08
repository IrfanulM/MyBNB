import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return res.json({ isAuthenticated: true, email: payload.email });
  } catch {
    return res.json({ isAuthenticated: false });
  }
}