import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailListDto } from './create-email-list.dto';

export class UpdateEmailListDto extends PartialType(CreateEmailListDto) {}
