import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';

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
      throw new Error(err.message);
    }
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.collection.findOne({ email });
      return user;
    } catch(err) {
      throw new Error(err.message);
    }
  }

  public async findOneById(userId: ObjectId): Promise<User | null> {
    try {
      const user = await this.collection.findOne({ _id: userId });
      return user;
    } catch(err) {
      throw new Error(err.message);
    }
  }
}


export default UserRepository;