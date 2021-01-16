import  { Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import * as jwt from 'jsonwebtoken';

import UserRepository from '../user/UserRepository'; 
import AuthTokenPayload from '../auth/AuthTokenPayload';
import AuthRequest from '../core/AuthRequest';


const authUser = async (req: AuthRequest, _: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization');

  if (token) {
    const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
    const payload = await jwt.verify(token, TOKEN_SECRET) as AuthTokenPayload;

    const user = await UserRepository.getInstance().findOneById(new ObjectId(payload._id));

    if (user) {
      req.user = user;
      req.user._id = new ObjectId(user._id);
      next();
    } else {
      next(new Error("Unauthorized"));
    }
  } else {
    next(new Error("Unauthorized"));
  }
}

export default authUser;