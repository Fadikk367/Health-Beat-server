import { ValidateNested, IsArray } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import AddMeasurementDto from './AddMeasurementDto';


export default class SyncMeasurementsDto {

  @Expose()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => AddMeasurementDto)
  public measurements: AddMeasurementDto[];

  constructor(measurements: AddMeasurementDto[]) {
    this.measurements = measurements;
  }
}