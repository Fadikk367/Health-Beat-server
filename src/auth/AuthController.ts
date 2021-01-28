import { RequestHandler } from 'express';
import http from 'http-errors';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import Controller from '../core/Controller';
import RegisterUserDto from '../user/RegisterUserDto';
import AuthCredentialsDto from './AuthCredentialsDto';
import UserRepository from '../user/UserRepository'; 

import validateBodyAs from '../middlewares/validateBodyAs';


export default class AuthController extends Controller {
  private userRepository = UserRepository.getInstance();

  constructor() {
    super('auth');

    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post('/login', validateBodyAs(AuthCredentialsDto), this.signIn);
    this.router.post('/register', validateBodyAs(RegisterUserDto), this.signUp);
  }

  private signIn: RequestHandler = async (req, res, next): Promise<void> => {
    const authCredentialsDto: AuthCredentialsDto = req.body;

    try {
      const user = await this.userRepository.findOneByEmail(authCredentialsDto.email);
      const isPasswordCorrect = await bcrypt.compare(authCredentialsDto.password, user.password as string);
  
      if (isPasswordCorrect) {
        const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
        const token = await jwt.sign({ _id: user._id, firstName: user.firstName, lastName: user.lastName }, TOKEN_SECRET);

        delete user.password;
        res.status(200).json({ 
          token, 
          user,
        });
      } else {
        throw new http.NotFound('Invalid email or password');
      }
    } catch(err) {
      next(err)
    }
  }

  private signUp: RequestHandler = async (req, res, next): Promise<void> => {
    const registerUserDto: RegisterUserDto = req.body;

    try {
      const user = await this.userRepository.registerUser(registerUserDto);
      const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
      const token = await jwt.sign({ _id: user._id, firstName: user.firstName, lastName: user.lastName }, TOKEN_SECRET);
  
      delete user.password;
      res.status(201).send({
        user,
        token,
      });
    } catch(err) {
      next(err);
    }
  }
}