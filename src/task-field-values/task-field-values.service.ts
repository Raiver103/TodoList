import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { TaskFieldOption } from 'src/task-fields/entities/task-field-option.entity'; 
import { TaskField } from 'src/task-fields/entities/task-field.entity';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm'; 
import { TaskFieldNumberValue } from './entities/task-field-number-value.entity';
import { TaskFieldStringValue } from './entities/task-field-string-value.entity';
import { TaskFieldOptionValue } from './entities/task-field-option-value.entity';

@Injectable()
export class TaskFieldValuesService {

  constructor(
    @InjectRepository(TaskFieldNumberValue)
    private taskNumericFieldValueRepository: Repository<TaskFieldNumberValue>,
    @InjectRepository(TaskFieldStringValue)
    private taskStringFieldValueRepository: Repository<TaskFieldStringValue>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskFieldOptionValue)
    private taskOptionFieldValueRepository: Repository<TaskFieldOptionValue>,
    @InjectRepository(TaskField)
    private taskFieldsRepository: Repository<TaskField>,
    @InjectRepository(TaskFieldOption)
    private taskFieldOptionRepository: Repository<TaskFieldOption>,
  ) {}
 
  async createTaskFieldNumber(user: User, taskId: number, fieldId: number, value: number)  {
    const task = await this.taskRepository.findOne({ where: { id: taskId }, 
      relations: ['column', 'column.project', 'column.project.user'] });
       
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const field = await this.taskFieldsRepository.findOne({ where: { id: fieldId },
      relations: ['project', 'project.user'], });

    if (!field) {
      throw new NotFoundException('Field not found');
    } 

    if(field.type != 'number'){
      throw new NotFoundException('field type must be number');
    } 

    if (task.column.project.user.id !== user.id || field.project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to add values to this task field');
    }
    
    const newValue = new TaskFieldNumberValue();
    newValue.task = task;
    newValue.taskField = field;
    newValue.value = value;
    return this.taskNumericFieldValueRepository.save(newValue);
  }
 
  async createTaskFieldString(user: User, taskId: number, fieldId: number, value: string) {
    const task = await this.taskRepository.findOne({ where: { id: taskId },
      relations: ['column', 'column.project', 'column.project.user'] });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const field = await this.taskFieldsRepository.findOne({ where: { id: fieldId },
      relations: ['project', 'project.user'] });

    if (!field) {
      throw new NotFoundException('Field not found');
    } 
    
    if(field.type != 'string'){
      throw new NotFoundException('field type must be string');
    }

    if (task.column.project.user.id !== user.id || field.project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to add values to this task field');
    }
  
    const newValue = new TaskFieldStringValue();
    newValue.task = task;
    newValue.taskField = field;
    newValue.value = value;
    return this.taskStringFieldValueRepository.save(newValue);
  }

  async createTaskFieldOption(user: User, taskId: number, fieldId: number, optionId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId },
      relations: ['column', 'column.project', 'column.project.user'] });
 
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const field = await this.taskFieldsRepository.findOne({ where: { id: fieldId },
      relations: ['project', 'project.user'] });

    const projectId = field.project.id;
 
    if (!field) {
      throw new NotFoundException('Field not found');
    } 

    if(projectId != task.column.project.id){ 
      throw new NotFoundException('this task in another project');
    }

    if (field.type != 'option') {
      throw new NotFoundException('field type must be option');
    } 

    if (task.column.project.user.id !== user.id || field.project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to add values to this task field');
    }
    
    const option = await this.taskFieldOptionRepository.findOne({ where: { id: optionId, taskField: field } });

    if (!option) {
      throw new NotFoundException('Option not found');
    }

    const newValue = new TaskFieldOptionValue();
    newValue.task = task;
    newValue.option = option;
    return this.taskOptionFieldValueRepository.save(newValue);
  }

  async getAllOptions(user: User) {
    const options = await this.taskFieldOptionRepository
      .createQueryBuilder('option')
      .leftJoin('option.taskField', 'taskField')
      .leftJoin('taskField.project', 'project')
      .leftJoin('project.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .select([
        'option.id',
        'option.value',
        'taskField.id',
        'taskField.name',
        'project.id',
        'project.name',
      ])
      .getMany();
    
    return options;
  }
}
