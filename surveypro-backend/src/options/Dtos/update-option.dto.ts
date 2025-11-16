import { PartialType } from "@nestjs/mapped-types";
import { CreateOptionDTO } from "./create-option.dto";

export class UpdateOptionDTO extends PartialType(CreateOptionDTO){
}