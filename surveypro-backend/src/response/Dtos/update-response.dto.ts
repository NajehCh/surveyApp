import { PartialType } from "@nestjs/mapped-types";
import { CreateResponseDTO } from "./create-response.dto"; 
export class UpdateResponseDTO extends PartialType(CreateResponseDTO){
}