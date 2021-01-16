import { ObjectId } from 'mongodb';

import { TimeOfDay } from '../core/enums';


export default interface Measurement {
  _id: ObjectId;
  userId: ObjectId;
  systolic: number;
  diastolic: number;
  date: Date;
  timeOfDay: TimeOfDay;
}