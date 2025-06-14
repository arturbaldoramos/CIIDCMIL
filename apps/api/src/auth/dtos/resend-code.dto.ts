import { IsEmail } from 'class-validator';

export class ResendCodeDto {
  @IsEmail()
  email: string;
}