import { RequestHandler } from 'express';
import * as bcrypt from 'bcrypt';
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

  private signIn: RequestHandler = async (req, res): Promise<void> => {
    const authCredentialsDto: AuthCredentialsDto = req.body;

    const user = await this.userRepository.findOneByEmail(authCredentialsDto.email);

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(authCredentialsDto.password, user.password);

      if (isPasswordCorrect) {
        const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

        const token = await jwt.sign({ _id: user._id, firstName: user.firstName, lastName: user.lastName }, TOKEN_SECRET);

        res.status(200).json({ token, user });
      } else {
        res.status(404).json({ message: 'Invalid user credentials' });
      }
    } else {
      res.status(404).json({ message: 'Invalid user credentials' });
    }
  }

  private signUp: RequestHandler = async (req, res): Promise<void> => {
    const registerUserDto: RegisterUserDto = req.body;

    const user = await this.userRepository.registerUser(registerUserDto);
    const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
    const token = await jwt.sign({ _id: user._id, firstName: user.firstName, lastName: user.lastName }, TOKEN_SECRET);

    res.status(201).send({
      user,
      token,
    })
  }
}