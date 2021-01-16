import { ObjectId } from "mongodb";

export default interface AuthTokenPayload {
  _id: ObjectId;
  firstName: string;
  lastName: string;
}