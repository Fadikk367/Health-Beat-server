import { ObjectId } from 'mongodb';


export default interface User {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  birthDate: Date;
}