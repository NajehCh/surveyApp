import { 
  IsString, 
  IsNotEmpty,
  IsEmail,
  IsOptional, 
  ValidateNested,
  ArrayMinSize
} from "class-validator";
import { Type } from "class-transformer";

class AnswerDTO {
  @IsString({ message: "id_question must be a string (UUID)" })
  @IsNotEmpty({ message: "id_question is required" })
  readonly id_question: string;

  @IsString({ message: "id_option must be a string (UUID)" })
  @IsOptional()
  readonly id_option?: string;

  @IsString({ message: "Value must be a string" })
  @IsNotEmpty({ message: "Value is required" })
  readonly value: string;
}

export class CreateResponseDTO {
  @IsString({ message: "id_enquete must be a string (UUID)" })
  @IsNotEmpty({ message: "id_enquete is required" })
  readonly id_enquete: string;

  @IsEmail({}, { message: "Incorrect email" })
  @IsNotEmpty({ message: "email is required" })
  readonly email: string;

  @ValidateNested({ each: true })
  @Type(() => AnswerDTO)
  @ArrayMinSize(1, { message: "At least one answer is required" })
  readonly answers: AnswerDTO[];
}
