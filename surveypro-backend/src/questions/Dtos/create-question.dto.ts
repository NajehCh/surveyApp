import { 
    IsDate, 
    IsString, 
    Length, 
    IsNotEmpty, 
    IsIn, 
    IsOptional, 
    MinDate, 
    IsInt,
    IsArray,
    IsBoolean,
    IsEnum,
    ValidateNested,
    IsUUID
  } from "class-validator";
  import { Type } from "class-transformer";


  export enum QuestionType {
    RADIO = 'radio',
    SELECT = 'select',
    CHECKBOX = 'checkbox',
    TEXT = 'text',
    RATING = 'rating',
    YES_NO = 'yes_no',
  }
  
  export class CreateQuestionDTO {
    
    @IsString({ message: "Question text must be a string" })
    @Length(2, 200, { message: "Question text must be between 2 and 200 characters" })
    readonly text_question: string;


    @IsString({ message: "id_enquete must be a string (UUID)" })
    @IsNotEmpty({ message: "id_enquete is required" })
    readonly id_enquete: string;

    @IsBoolean({ message: "Question required must be true or false" })
    @IsOptional()
    readonly required?: boolean = false;

    // @IsIn(["radio", "select", "checkbox","text","rating","yes_no"], { 
    //   message: "Question type must be one of: radio, select, text,checkbox, rating,yes_no. " 
    // })
    // @IsOptional() 
    // readonly type?: "radio" | "select" | "checkbox" | "text" | "rating" | "yes_no";
    @IsEnum(QuestionType, { message: 'Invalid question type' })
    readonly type: QuestionType;


    @Type(() => Date)
    @IsDate({ message: "Start date must be a valid date" })
    // @MinDate(new Date(), { message: "Start date must be today or in the future" })
    readonly createdAt?: Date;
  
    @Type(() => Date)
    @IsDate({ message: "End date must be a valid date" })
    @IsOptional()
    readonly updatedAt?: Date;
    
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => CreateOptionDTO)
    // @IsOptional() 
    // readonly option?: CreateOptionDTO[];

    @IsArray({ message: "Options must be an array of strings" })
    @IsString({ each: true, message: "Each option must be a string" })
    @IsOptional()
    readonly options?: string[];
  
  }

  