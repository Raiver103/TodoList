import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { ProjectsService } from 'src/projects/projects.service';
import { ColumnEntity } from 'src/columns/column.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class TasksService {
  
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(ColumnEntity)
    private columnsRepository: Repository<ColumnEntity> 
  ) {}

  async create(user: User, createTaskDto: CreateTaskDto, columnId: number) {  
    const column = await this.columnsRepository.findOne({
      where: {
        id: columnId,
        project: {
          user: {
            id: user.id,
          },
        },
      }, 
      relations: ['project', 'project.user'] 
    });   

    if (!column || column.project.user.id !== user.id) {
      throw new NotFoundException('Column not found');
    } 

    const task = this.tasksRepository.create({ 
      ...createTaskDto, 
      column, 
      createdAt: new Date(), 
      order: await this.getNextTaskOrder(columnId) 
    });
    
    return this.tasksRepository.save(task);
  }

  async update(user: User, dto: CreateTaskDto, taskId: number){ 
    const task = await this.tasksRepository.findOne({
      where: {
        id: taskId,
        column: {
          project: {
            user:{ 
              id: user.id,
            }
          },
        },
      },
      relations: ['column', 'column.project', 'column.project.user'] 
    });  

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async remove(user: User, taskId: number) {
    const task = await this.tasksRepository.findOne({ 
      where: { id: taskId }, 
      relations: ['column', 'column.project', 'column.project.user'] 
    });
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
 
    const tasksInColumn = await this.tasksRepository.find({
      where: { column: task.column },
      order: { order: 'ASC' },
    });

    // Remove task from the column
    const taskIndex = tasksInColumn.findIndex(t => t.id === task.id);
    if (taskIndex > -1) {
      tasksInColumn.splice(taskIndex, 1);
    }

    // Update order of remaining tasks in the column
    for (let i = 0; i < tasksInColumn.length; i++) {
      tasksInColumn[i].order = i + 1;
      await this.tasksRepository.save(tasksInColumn[i]);
    }

    await this.tasksRepository.remove(task);
  }

  async move(user: User, taskId: number, newColumnId: number, newOrder: number) {

    const task = await this.tasksRepository.findOne({ 
      where: { id: taskId }, 
      relations: ['column', 'column.project', 'column.project.user']
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.column.project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to move this task');
    }

    const currentColumn = task.column;

    if (currentColumn.id === newColumnId) {
      // If task is moved within the same column
      const tasksInCurrentColumn = await this.tasksRepository.find({
        where: { column: currentColumn },
        order: { order: 'ASC' },
      });

      // Ensure newOrder is within bounds
      if (newOrder < 1 || newOrder > tasksInCurrentColumn.length) {
        throw new Error('New order is out of bounds');
      }

      // Remove task from the column
      const taskIndex = tasksInCurrentColumn.findIndex(t => t.id === task.id);
      if (taskIndex > -1) {
        tasksInCurrentColumn.splice(taskIndex, 1);
      }

      // Insert task at new position
      tasksInCurrentColumn.splice(newOrder - 1, 0, task);

      // Update order of tasks in the column
      for (let i = 0; i < tasksInCurrentColumn.length; i++) {
        tasksInCurrentColumn[i].order = i + 1;
        await this.tasksRepository.save(tasksInCurrentColumn[i]);
      }
    } else {
      // If task is moved to a different column
      const newColumn = await this.columnsRepository.findOne({ where: { id: newColumnId }, relations: ['project', 'project.user'] });
      if (!newColumn) {
        throw new NotFoundException('New column not found');
      }

      if (newColumn.project.user.id !== user.id) {
        throw new UnauthorizedException('You are not authorized to move this task');
      }

      const tasksInCurrentColumn = await this.tasksRepository.find({
        where: { column: currentColumn },
        order: { order: 'ASC' },
      });

      const tasksInNewColumn = await this.tasksRepository.find({
        where: { column: newColumn },
        order: { order: 'ASC' },
      });

      // Ensure newOrder is within bounds
      if (newOrder < 1 || newOrder > tasksInNewColumn.length + 1) {
        throw new Error('New order is out of bounds');
      }

      // Remove task from the current column
      const taskIndex = tasksInCurrentColumn.findIndex(t => t.id === task.id);
      if (taskIndex > -1) {
        tasksInCurrentColumn.splice(taskIndex, 1);
      }

      // Update order of remaining tasks in the current column
      for (let i = 0; i < tasksInCurrentColumn.length; i++) {
        tasksInCurrentColumn[i].order = i + 1;
        await this.tasksRepository.save(tasksInCurrentColumn[i]);
      }

      // Insert task at new position in the new column
      tasksInNewColumn.splice(newOrder - 1, 0, task);

      // Update order of tasks in the new column
      for (let i = 0; i < tasksInNewColumn.length; i++) {
        tasksInNewColumn[i].order = i + 1;
        await this.tasksRepository.save(tasksInNewColumn[i]);
      }

      // Update task's column reference
      task.column = newColumn;
      await this.tasksRepository.save(task);
    }
  } 

  async getNextTaskOrder(columnId: number) {
    const result = await this.tasksRepository
      .createQueryBuilder('task')
      .select('MAX(task.order)', 'maxOrder')
      .where('task.columnId = :columnId', { columnId })
      .getRawOne();
    return (result.maxOrder || 0) + 1;
  }
}
