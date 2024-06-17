import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TaskFieldsService } from './task-fields.service';
import { CreateTaskFieldDto } from './dto/create-task-field.dto'; 

@ApiTags('Task Fields')
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard) 
export class TaskFieldsController {

  constructor(private readonly taskFieldsService: TaskFieldsService) {}
 
  @ApiOperation( { summary:"Create task field" } ) 
  @Post('projects/:projectId/task-fields')
  create(
    @Req() req, 
    @Param('projectId') projectId: number,  
    @Body() dto: CreateTaskFieldDto,
  ) {
      
    return this.taskFieldsService.create(req.user, projectId, dto.name, dto.type, dto?.options);
  }

  @ApiOperation( { summary:"Update task field" } ) 
  @Put('projects/:projectId/task-fields/:fieldId')
  update(
    @Req() req, 
    @Param('fieldId') fieldId: number,
    @Body() dto: CreateTaskFieldDto,
  ) {

    return this.taskFieldsService.update(req.user, fieldId, dto.name, dto.type);
  }

  @ApiOperation( { summary:"Delete task field" } ) 
  @Delete('projects/:projectId/task-fields/:fieldId')
  delete(
    @Req() req, 
    @Param('fieldId') fieldId: number
  ) {

    return this.taskFieldsService.delete(req.user, fieldId);
  }

  @ApiOperation( { summary:"Get task fields" } ) 
  @Get('projects/:projectId/task-fields')
  findAll(
    @Req() req, 
    @Param('projectId') projectId: number
  ) {

    return this.taskFieldsService.findAll(req.user, projectId);
  }
}
