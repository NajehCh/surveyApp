import { PartialType } from "@nestjs/mapped-types";
import { CreateEnqueteDTO } from "./create-enquete.dto";

export class UpdateEnqueteDTO extends PartialType(CreateEnqueteDTO){
}