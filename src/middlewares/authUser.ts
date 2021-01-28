import  { Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import * as jwt from 'jsonwebtoken';
import http from 'http-errors';

import UserRepository from '../user/UserRepository'; 
import AuthTokenPayload from '../auth/AuthTokenPayload';
import AuthRequest from '../core/AuthRequest';


const authUser = async (req: AuthRequest, _: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization');

  if (token) {
    const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

    try {
      const payload = await jwt.verify(token, TOKEN_SECRET) as AuthTokenPayload;
      const user = await UserRepository.getInstance().findOneById(new ObjectId(payload._id));

      if (user) {
        req.user = user;
        req.user._id = new ObjectId(user._id);
        next();
      } else {
        next(new http.Unauthorized("Unauthorized"));
      }

    } catch(err) {
      next(err);
    }
  } else {
    next(new http.Unauthorized("Unauthorized"));
  }
}

export default authUser;