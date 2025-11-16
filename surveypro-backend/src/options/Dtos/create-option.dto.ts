import { 
    IsString, 
    Length, 

    IsOptional, 
  } from "class-validator";
  import { Type } from "class-transformer";
  
  export class CreateOptionDTO {
    
    @IsString({ message: "Option text must be a string" })
    @Length(3, 200, { message: "Option text must be between 3 and 200 characters" })
    readonly text_option: string;


    @IsString({ message: "id_question must be a string (UUID)" })
    @IsOptional()
    readonly id_question: string;

  }
  