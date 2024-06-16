import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TaskFieldsService } from './task-fields.service';
import { CreateTaskFieldDto } from './dto/create-task-field.dto';
import { CreateTaskFieldStringDto } from './dto/create-task-field-string.dto';
import { CreateTaskFieldNumberDto } from './dto/create-task-field-number.dto';

@ApiTags('TaskFields')
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
    @Body() body: CreateTaskFieldDto,
  ) {
      
    return this.taskFieldsService.create(req.user, projectId, body.name, body.type);
  }

  @ApiOperation( { summary:"Update task field" } ) 
  @Put('projects/:projectId/task-fields/:fieldId')
  update(
    @Req() req, 
    @Param('fieldId') fieldId: number,
    @Body() body: CreateTaskFieldDto,
  ) {

    return this.taskFieldsService.update(req.user, fieldId, body.name, body.type);
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

  @ApiOperation( { summary:"Add value to task field(number)" } ) 
  @Post(':fieldId/number/:taskId/task')
  createTaskFieldNumber(
    @Req() req, 
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('fieldId', ParseIntPipe) fieldId: number,
    @Body() value: CreateTaskFieldNumberDto,
  ) { 

    return this.taskFieldsService.createTaskFieldNumber(req.user, taskId, fieldId, +value.value);
  }

  @ApiOperation( { summary:"Add value to task field(string)" } ) 
  @Post(':fieldId/string/:taskId/task')
  createTaskFieldString(
    @Req() req, 
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('fieldId', ParseIntPipe) fieldId: number,
    @Body() value: CreateTaskFieldStringDto,
  ) {
 
    return this.taskFieldsService.createTaskFieldString(req.user, taskId, fieldId, value.value);
  }
}
