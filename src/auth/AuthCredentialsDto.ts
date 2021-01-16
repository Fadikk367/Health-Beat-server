import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';


export default class AuthCredentialsDto {
  @Expose()
  @IsString({ message: 'missing email' })
  public email: string;

  @Expose()
  @IsString({ message: 'missing password' })
  public password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}