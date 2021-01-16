import { IsDateString, IsEnum, IsPositive } from 'class-validator';
import { Expose } from 'class-transformer';

import { TimeOfDay } from '../core/enums';


export default class AddMeasurementDto {
  @Expose()
  @IsDateString(undefined, { message: 'Invalid date format'})
  public date: Date;

  @Expose()
  @IsPositive({ message: 'Preassure result must be a positive number' })
  public systolic: number;

  @Expose()
  @IsPositive({ message: 'Preassure result must be a positive number' })
  public diastolic: number;

  @Expose()
  @IsEnum(TimeOfDay, { message: 'Invalid time of day constant' })
  public timeOfDay: TimeOfDay;

  constructor(date: Date, systolic: number, diastolic: number, timeOfDay: TimeOfDay) {
    this.date = date;
    this.systolic = systolic;
    this.diastolic = diastolic;
    this.timeOfDay = timeOfDay;
  }
}