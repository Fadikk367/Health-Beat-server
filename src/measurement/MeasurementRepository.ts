import { ObjectId } from 'mongodb';
import http from 'http-errors';

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
    const result = await this.collection.insertOne({ ...addMeasurementDto, userId: user._id });
    if (result.insertedCount === 1) {
      return result.ops[0];
    } else {
      const error = new http.InternalServerError('Failed to insert new measurement');
      error.expose = true;
      throw error;
    }
  }

  public async addMany(addMeasurementDtos: AddMeasurementDto[], user: User): Promise<Measurement[]> {
    const result = await this.collection.insertMany(addMeasurementDtos.map(measurement => ({...measurement, userId: user._id})));
    return result.ops;
  }

  public async findByUserId(userId: ObjectId): Promise<Measurement[]> {
    const measurements = await this.collection.find({ userId }).toArray();
    return measurements;
  }

  public async deleteOne(measurementId: ObjectId, user: User): Promise<void> {
    const result = await this.collection.deleteOne({ _id: measurementId, userId: user._id });
    if (result.deletedCount === 0) {
      throw new http.NotFound('Document to delete not found');
    }
  }
}


export default MeasurementRepository;