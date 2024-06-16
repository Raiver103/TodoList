import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MoveTaskDto } from './dto/move-task.dto';
import { Task } from './task.entity';


@ApiBearerAuth() 
@UseGuards(JwtAuthGuard)
@ApiTags("Tasks") 
@Controller('columns/:columnId/tasks')
export class TasksController {

  constructor(private readonly tasksService: TasksService) {}
  
  @ApiOperation( { summary:"Create task" } ) 
  @Post()
  createTask(
    @Req() req,
    @Body() createTaskDto: CreateTaskDto, 
    @Param('columnId', ParseIntPipe) columnId: number 
  ) {  
    return this.tasksService.create(req.user, createTaskDto, columnId);
  }

  @ApiOperation( { summary:"Get task" } ) 
  @Get(':taskId')
  getTask(
    @Req() req, 
    @Param('taskId', ParseIntPipe) taskId: number 
  ) {  
    return this.tasksService.get(req.user, taskId);
  }
  
  @ApiOperation( { summary:"Update task" } ) 
  @Put(":taskId")
  updateTask(
    @Req() req,
    @Body() updateTaskDto: CreateTaskDto,
    @Param('taskId', ParseIntPipe) taskId: number 
  ) {   
    return this.tasksService.update(req.user, updateTaskDto, taskId );
  } 

  @ApiOperation( { summary:"Delete task" } ) 
  @Delete(':taskId')
  removeTask(
    @Req() req, 
    @Param('taskId', ParseIntPipe) taskId: number
  ) { 
    return this.tasksService.remove(req.user, taskId );
  }

  @ApiOperation( { summary:"Move task" } ) 
  @Patch(':taskId/move')
  @UseGuards(JwtAuthGuard)
  async moveTask(
    @Req() req, 
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('columnId', ParseIntPipe) newColumnId: number,
    @Body() newOrder: MoveTaskDto,
  ) { 

    return this.tasksService.move(req.user, taskId, newColumnId, +newOrder.order);
  }
}
