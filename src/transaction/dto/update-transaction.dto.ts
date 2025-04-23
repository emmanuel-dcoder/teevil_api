import { PartialType } from '@nestjs/swagger';
import { CreateProposalDto } from './create-transaction.dto';

export class UpdateProposalDto extends PartialType(CreateProposalDto) {}
