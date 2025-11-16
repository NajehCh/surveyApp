import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEmailListDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email obligatoire' })
  readonly email: string;
}
