import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm'; 
import { ColumnEntity } from 'src/columns/column.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/users/user.entity'; 
import { TaskField } from 'src/task-fields/entities/task-field.entity'; 
import { TaskFieldStringValue } from 'src/task-field-values/entities/task-field-string-value.entity';
import { TaskFieldNumberValue } from 'src/task-field-values/entities/task-field-number-value.entity';

@Injectable()
export class TasksService {
 
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(ColumnEntity)
    private columnsRepository: Repository<ColumnEntity>,
    @InjectRepository(TaskFieldStringValue)
    private stringFieldValuesRepository: Repository<TaskFieldStringValue>,
    @InjectRepository(TaskFieldNumberValue)
    private numberFieldValuesRepository: Repository<TaskFieldNumberValue>,
    @InjectRepository(TaskField)
    private taskFieldsRepository: Repository<TaskField>,
  ) {}

  async create(user: User, createTaskDto: CreateTaskDto, columnId: number) {  
    const column = await this.getUsersColumn(columnId, user);   

    if (!column || column.project.user.id !== user.id) {
      throw new NotFoundException('Column not found');
    } 

    const task = this.tasksRepository.create({ 
      ...createTaskDto, 
      column, 
      createdAt: new Date(), 
      order: await this.getNextTaskOrder(columnId) 
    });
    
    const savedTask = await this.tasksRepository.save(task);

    const fields = await this.taskFieldsRepository.find({ where: { project: column.project } });

    await this.manageTaskFieldValues(fields, createTaskDto, savedTask);
    
    return savedTask;
  }

  async get(user: User, taskId: number) {
    const task = await this.getUserTask(taskId, user);  

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  } 

  async update(user: User, dto: CreateTaskDto, taskId: number){ 
    const task = await this.getUserTask(taskId, user);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, dto);const fields = await this.taskFieldsRepository.find({ where: { project: task.column.project } });

    const savedTask = await this.tasksRepository.save(task);

    await this.updateTaskFields(fields, dto, task);

    return savedTask;
  }  

  async remove(user: User, taskId: number) {
    const task = await this.getUserTask(taskId, user);
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
 
    const tasksInColumn = await this.tasksRepository.find({
      where: { column: task.column },
      order: { order: 'ASC' },
    });
  
    this.removeTaskFromColumn(tasksInColumn, task);
 
    await this.updateOrderOfRemainingTasksInColumn(tasksInColumn);

    await this.tasksRepository.remove(task);
  }

  async move(user: User, taskId: number, newColumnId: number, newOrder: number) {

    const task = await this.getUserTask(taskId, user);

    if (!task) {
      throw new NotFoundException('Task not found');
    } 

    await this.moveTask(task, newColumnId, newOrder, user);
  }  

  private async moveTask(task: Task, newColumnId: number, newOrder: number, user: User) {
    const currentColumn = task.column;

    if (currentColumn.id === newColumnId) {
      const tasksInCurrentColumn = await this.tasksRepository.find({
        where: { column: currentColumn },
        order: { order: 'ASC' },
      });

      if (newOrder < 1 || newOrder > tasksInCurrentColumn.length) {
        throw new Error('New order is out of bounds');
      }

      this.removeTaskFromColumn(tasksInCurrentColumn, task);

      tasksInCurrentColumn.splice(newOrder - 1, 0, task);

      await this.updateOrderOfTasksInColumn(tasksInCurrentColumn);
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
      this.removeTaskFromCurrentColumn(tasksInCurrentColumn, task);

      // Update order of remaining tasks in the current column
      await this.updateOrderOfRemainingTasksInCurrentColumn(tasksInCurrentColumn);

      // Insert task at new position in the new column
      tasksInNewColumn.splice(newOrder - 1, 0, task);

      // Update order of tasks in the new column
      await this.updateOrderOfTasksInNewColumn(tasksInNewColumn);

      // Update task's column reference
      task.column = newColumn;
      await this.tasksRepository.save(task);
    }
  }

  private async updateOrderOfTasksInNewColumn(tasksInNewColumn: Task[]) {
    for (let i = 0; i < tasksInNewColumn.length; i++) {
      tasksInNewColumn[i].order = i + 1;
      await this.tasksRepository.save(tasksInNewColumn[i]);
    }
  }

  private async updateOrderOfRemainingTasksInCurrentColumn(tasksInCurrentColumn: Task[]) {
    for (let i = 0; i < tasksInCurrentColumn.length; i++) {
      tasksInCurrentColumn[i].order = i + 1;
      await this.tasksRepository.save(tasksInCurrentColumn[i]);
    }
  }

  private removeTaskFromCurrentColumn(tasksInCurrentColumn: Task[], task: Task) {
    const taskIndex = tasksInCurrentColumn.findIndex(t => t.id === task.id);
    if (taskIndex > -1) {
      tasksInCurrentColumn.splice(taskIndex, 1);
    }
  }

  private async updateOrderOfTasksInColumn(tasksInCurrentColumn: Task[]) {
    for (let i = 0; i < tasksInCurrentColumn.length; i++) {
      tasksInCurrentColumn[i].order = i + 1;
      await this.tasksRepository.save(tasksInCurrentColumn[i]);
    }
  }

  private async getUserTask(taskId: number, user: User) {
    return await this.tasksRepository.findOne({
      where: {
        id: taskId,
        column: {
          project: {
            user: {
              id: user.id,
            }
          },
        },
      },
      relations: ['column', 'column.project', 'column.project.user', 'stringFieldValues', 'numberFieldValues']
    });
  }

  private async getUsersColumn(columnId: number, user: User) {
    return await this.columnsRepository.findOne({
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
  }

  private async manageTaskFieldValues(fields: TaskField[], createTaskDto: CreateTaskDto, savedTask: Task) {
    for (const field of fields) {
      if (createTaskDto.stringFields && createTaskDto.stringFields[field.id]) {
        await this.stringFieldValuesRepository.save({
          task: savedTask,
          taskField: field,
          value: createTaskDto.stringFields[field.id],
        });
      } else if (createTaskDto.numberFields && createTaskDto.numberFields[field.id]) {
        await this.numberFieldValuesRepository.save({
          task: savedTask,
          taskField: field,
          value: createTaskDto.numberFields[field.id],
        });
      }
    }
  }

  private async updateTaskFields(fields: TaskField[], dto: CreateTaskDto, task: Task) {
    for (const field of fields) {
      if (field.type === 'string' && dto.stringFields && dto.stringFields[field.id]) {
        let fieldValue = await this.stringFieldValuesRepository.findOne({ where: { task, taskField: field } });
        if (fieldValue) {
          fieldValue.value = dto.stringFields[field.id];
        } else {
          fieldValue = this.stringFieldValuesRepository.create({
            task,
            taskField: field,
            value: dto.stringFields[field.id],
          });
        }
        await this.stringFieldValuesRepository.save(fieldValue);
      } else if (field.type === 'number' && dto.numberFields && dto.numberFields[field.id]) {
        let fieldValue = await this.numberFieldValuesRepository.findOne({ where: { task, taskField: field } });
        if (fieldValue) {
          fieldValue.value = dto.numberFields[field.id];
        } else {
          fieldValue = this.numberFieldValuesRepository.create({
            task,
            taskField: field,
            value: dto.numberFields[field.id],
          });
        }
        await this.numberFieldValuesRepository.save(fieldValue);
      }
    }
  }

  private async updateOrderOfRemainingTasksInColumn(tasksInColumn: Task[]) {
    for (let i = 0; i < tasksInColumn.length; i++) {
      tasksInColumn[i].order = i + 1;
      await this.tasksRepository.save(tasksInColumn[i]);
    } 
  }

  private removeTaskFromColumn(tasksInColumn: Task[], task: Task) {
    const taskIndex = tasksInColumn.findIndex(t => t.id === task.id);
    if (taskIndex > -1) {
      tasksInColumn.splice(taskIndex, 1);
    } 
  }

  private async getNextTaskOrder(columnId: number) {
    const result = await this.tasksRepository
      .createQueryBuilder('task')
      .select('MAX(task.order)', 'maxOrder')
      .where('task.columnId = :columnId', { columnId })
      .getRawOne();
    return (result.maxOrder || 0) + 1;
  }
} 
