import { ObjectId } from 'mongodb';
import http from 'http-errors';
import * as bcrypt from 'bcryptjs';

import User from './User';
import client from '../db/Database';
import RegisterUserDto from './RegisterUserDto';


class UserRepository {
  private collection = client.getDb().collection<User>('users');
  private static instance: UserRepository | undefined;

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }

    return UserRepository.instance;
  }

  public async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hasedPassword = await bcrypt.hash(registerUserDto.password, salt);

      const result = await this.collection.insertOne({ ...registerUserDto, password: hasedPassword });
      return result.ops[0];
    } catch(err) {
      if (err.code === 11000) {
        console.log('duplicate key error');
        throw new http.BadRequest("User with given email address already exists");
      }
      throw new Error(err.message);
    }
  }

  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.collection.findOne({ email });
    if (!user) {
      throw new http.NotFound('Invalid email or password');
    }

    return user;
  }

  public async findOneById(userId: ObjectId): Promise<User> {
    const user = await this.collection.findOne({ _id: userId });
    if (!user) {
      throw new http.NotFound('Invalid email or password');
    }

    return user;
  }
}


export default UserRepository;