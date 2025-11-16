import { IsArray, ArrayNotEmpty, IsEmail, IsString } from 'class-validator';

export class SendEnqueteDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  emails: string[];

  @IsString()
  id_enquete: string;
}
