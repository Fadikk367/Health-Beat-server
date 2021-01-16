import { ObjectId } from 'mongodb';

import client from '../db/Database';
import Measurement from './Measurement';
import AddMeasurementDto from './AddMeasurementDto';
import User from 'user/User';


class MeasurementRepository {
  private collection = client.getDb().collection<Measurement>('measurements');
  private static instance: MeasurementRepository | undefined;

  private constructor() {}

  public static getInstance(): MeasurementRepository {
    if (!MeasurementRepository.instance) {
      MeasurementRepository.instance = new MeasurementRepository();
    }

    return MeasurementRepository.instance;
  }

  public async addOne(addMeasurementDto: AddMeasurementDto, user: User): Promise<Measurement> {
    try {
      const result = await this.collection.insertOne({ ...addMeasurementDto, userId: user._id });
      return result.ops[0];
    } catch(err) {
      throw new Error(err.message);
    }
  }

  public async findByUserId(userId: ObjectId): Promise<Measurement[]> {
    try {
      const measurements = await this.collection.find({ userId }).toArray();
      return measurements;
    } catch(err) {
      throw new Error(err.message);
    }
  }

  public async deleteOne(measurementId: ObjectId, user: User): Promise<void> {
    try {
      const result = await this.collection.deleteOne({ _id: measurementId, userId: user._id });
      console.log({ result });
    } catch(err) {
      throw new Error(err.message);
    }
  }
}


export default MeasurementRepository;