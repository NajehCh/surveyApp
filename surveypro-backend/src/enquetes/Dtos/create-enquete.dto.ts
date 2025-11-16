import { 
    IsDate, 
    IsString, 
    Length, 
    IsNotEmpty, 
    IsIn, 
    IsOptional, 
    MinDate, 
    IsInt,
    IsArray
  } from "class-validator";
  import { Type } from "class-transformer";


  export enum EnqueteStatus {
    draft = 'draft',
    active = 'active',
    closed = 'closed',
  }
  
  export class CreateEnqueteDTO {
    
    @IsString({ message: "Survey name must be a string" })
    @Length(4, 200, { message: "Survey name must be between 4 and 20 characters" })
    readonly enquete_name: string;
  
    @IsString({ message: "Description must be a string" })
    @IsNotEmpty({ message: "Description cannot be empty" })
    readonly description: string; 
  
    @Type(() => Date)
    @IsDate({ message: "Start date must be a valid date" })
    // @MinDate(new Date(), { message: "Start date must be today or in the future" })
    readonly startDate: Date;
  
    @Type(() => Date)
    @IsDate({ message: "End date must be a valid date" })
    @IsOptional()
    readonly endDate: Date;

    
    @IsString({ message: "Survey category must be a string" })
    @Length(2, 200, { message: "Survey name must be between 2 and 20 characters" })
    readonly category: string;

    @IsIn(["draft", "active", "closed"], { 
      message: "Status must be one of: draft, active, closed" 
    })
    @IsOptional() // optionnel car tu as un @default(draft) dans Prisma
    readonly status?: "draft" | "active" | "closed";

    @IsArray()
    @IsOptional()
    questions?: string[];

  }
  