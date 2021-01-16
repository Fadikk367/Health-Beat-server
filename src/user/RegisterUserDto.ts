import { IsEmail, IsDateString, Length, IsAlpha } from 'class-validator';
import { Expose } from 'class-transformer';


export default class RegisterUserDto {
  @Expose()
  @IsAlpha('pl-PL', { message: 'First name must only contain letters (a-zA-Z)' })
  @Length(2, 16, { message: 'First name must have 2 latters at least and 15 letters at most' })
  public firstName: string;

  @Expose()
  @IsAlpha('pl-PL', { message: 'Last name must only contain letters (a-zA-Z)' })
  @Length(2, 16, { message: 'Last name must have 2 latters at least and 15 letters at most' })
  public lastName: string;

  @Expose()
  @IsEmail(undefined, { message: 'Invalid email format' })
  public email: string;

  @Expose()
  @Length(8, 16, { message: 'password must have 8 letters at least and 15 letters at most' })
  public password: string;

  @Expose()
  @IsDateString(undefined, { message: 'Given string does not represent a valid date'})
  public birthDate: Date;

  constructor(firstName: string, lastName: string, email: string, password: string, birthDate: Date) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.birthDate = birthDate;
  } 
}