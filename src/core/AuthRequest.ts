import { Request } from 'express';

import User from '../user/User';


export default interface AuthRequest extends Request {
  user?: User;
}
