import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Developer from '../models/Developer';

const verify = promisify(jwt.verify);

export default async function protect(req: Request, res: Response, next: Function) {
  // Fetch token
  let token: string | undefined = undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Respond with 401 if no token
  if (!token) {
    return res.status(401).json({
      message: 'You are not logged in! Please login to get access',
    });
  }

  // Verify token
  // @ts-ignore
  const decoded: { id: string } = await verify(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentDeveloper = await Developer.findById(decoded.id);

  if (!currentDeveloper) {
    return res.status(401).json({ message: 'This user does not exist anymore.' });
  }

  // @ts-ignore
  req.user = currentDeveloper;
  next();
}
