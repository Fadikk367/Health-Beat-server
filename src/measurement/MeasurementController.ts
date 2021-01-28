import { Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

import AuthRequest from '../core/AuthRequest';
import Controller from "../core/Controller";
import authUser from "../middlewares/authUser";
import validateBodyAs from "../middlewares/validateBodyAs";
import AddMeasurementDto from "./AddMeasurementDto";
import SyncMeasurementsDto from "./SyncMeasurementsDto";
import MeasurementRepository from './MeasurementRepository';
import User from '../user/User';


class MeasurementController extends Controller {
  private measurementRepository = MeasurementRepository.getInstance();

  constructor() {
    super('measurements');

    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post('/', authUser, validateBodyAs(AddMeasurementDto), this.addMeasurement);
    this.router.post('/sync', authUser, validateBodyAs(SyncMeasurementsDto), this.syncMeasurements);
    this.router.get('/', authUser, this.getMeasurements);
    this.router.delete('/:id', authUser, this.deleteMeasurement);
  }

  private addMeasurement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const addMeasurementDto: AddMeasurementDto = req.body;

    try {
      const addedMeasurement = await this.measurementRepository.addOne(addMeasurementDto, req.user as User);
      res.status(201).json(addedMeasurement);
    } catch(err) {
      next(err);
    }
  }

  private getMeasurements = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as User;

    try {
      const measurements = await this.measurementRepository.findByUserId(user._id);
      res.status(201).json(measurements);
    } catch(err) {
      next(err);
    }
  }

  private deleteMeasurement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const measurementId = new ObjectId(req.params.id);
    
    try {
      await this.measurementRepository.deleteOne(measurementId, req.user as User);
      res.status(204).json({ success: true });
    } catch(err) {
      next(err);
    }
  }

  private syncMeasurements = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const data: SyncMeasurementsDto = req.body;
    const user = req.user as User;

    try {
      if (data.measurements.length) {
        await this.measurementRepository.addMany(data.measurements, user);
      }
      
      const measurements = await this.measurementRepository.findByUserId(user._id);
      res.status(201).json(measurements);
    } catch(err) {
      console.log(err);
      next(err);
    }
  }
}


export default MeasurementController;