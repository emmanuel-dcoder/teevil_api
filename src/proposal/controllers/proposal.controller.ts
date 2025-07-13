import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  Req,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/config/response';
import { ProposalService } from '../services/proposal.service';
import { CreateProposalDto } from '../dto/create-proposal.dto';
import { PaginationDto } from 'src/core/common/pagination/pagination';

@ApiTags('Freelancer & Client Proposal')
@Controller('api/v1/proposal')
@ApiBearerAuth()
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateProposalDto })
  @ApiOperation({ summary: 'Create a proposal' })
  @ApiResponse({ status: 201, description: 'Proposal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Req() req: any, @Body() createProposalDto: CreateProposalDto) {
    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    const data = await this.proposalService.createPropsosal({
      ...createProposalDto,
      submittedBy: userId,
    });
    return successResponse({
      message: 'Proposal created successfully',
      code: HttpStatus.CREATED,
      status: 'success',
      data,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get all proposals with search, pagination and status filter',
  })
  @ApiResponse({ status: 200, description: 'Proposals list' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'project name',
    description: 'Search query for proposal',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    example: 'pending',
    description:
      'Filter proposals by status (pending, accepted, rejected, under-review)',
  })
  async findAll(
    @Query() query: PaginationDto & { status?: string },
    @Req() req: any,
  ) {
    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    const data = await this.proposalService.findAll(query, userId);

    return successResponse({
      message: 'Proposal lists',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a proposal by ID' })
  @ApiResponse({ status: 200, description: 'Proposal retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.proposalService.findOne(id);
    return successResponse({
      message: 'Proposal retrieved successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }
}
