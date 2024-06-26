import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TaskFieldValuesService } from './task-field-values.service'; 
import { CreateTaskFieldNumberDto } from './dto/create-task-field-number.dto';
import { CreateTaskFieldStringDto } from './dto/create-task-field-string.dto';
import { CreateTaskFieldOptionDto } from './dto/create-task-field-option.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Task Field Values')
@Controller('tasks/:taskId/fields/:fieldId/values') 
export default class TaskFieldValuesController {
  
  constructor(private readonly taskFieldValuesService: TaskFieldValuesService) {}
 
  @ApiOperation( { summary:"Add value for number task field" } ) 
  @Post('number')
  createTaskFieldNumberValue(
    @Req() req,
    @Param('taskId') taskId: number,
    @Param('fieldId') fieldId: number,
    @Body() createTaskFieldNumberValueDto: CreateTaskFieldNumberDto,
  ) {
    return this.taskFieldValuesService.createTaskFieldNumber(
      req.user,
      taskId,
      fieldId,
      createTaskFieldNumberValueDto.value,
    );
  }

  @ApiOperation( { summary:"Add value for string task field" } ) 
  @Post('string')
  createTaskFieldStringValue(
    @Req() req,
    @Param('taskId') taskId: number,
    @Param('fieldId') fieldId: number,
    @Body() createTaskFieldStringValueDto: CreateTaskFieldStringDto,
  ) {
    return this.taskFieldValuesService.createTaskFieldString(
      req.user,
      taskId,
      fieldId,
      createTaskFieldStringValueDto.value,
    );
  }

  @ApiOperation( { summary:"Add value for option task field" } ) 
  @Post('option')
  createTaskFieldOptionValue(
    @Req() req,
    @Param('taskId') taskId: number,
    @Param('fieldId') fieldId: number,
    @Body() createTaskFieldOptionValueDto: CreateTaskFieldOptionDto,
  ) {
    return this.taskFieldValuesService.createTaskFieldOption(
      req.user,
      taskId,
      fieldId,
      createTaskFieldOptionValueDto.optionId,
    );
  }

  @ApiOperation( { summary:"Get all options of user" } ) 
  @Get()
  getAllOptions(@Req() req) {
    return this.taskFieldValuesService.getAllOptions(req.user)
  }
}
