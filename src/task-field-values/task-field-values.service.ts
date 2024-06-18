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
    private taskNumberFieldValueRepository: Repository<TaskFieldNumberValue>,
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
    
    return this.getOrCreateNumberValue(taskId, fieldId, value);
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
    return this.getOrCreateStringValue(taskId, fieldId, value);
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
    const existingValue = await this.taskOptionFieldValueRepository.findOne({
      where: {
        task: { id: taskId },
        option: { taskField: { id: fieldId } }
      },
      relations: ['task', 'option', 'option.taskField']
    });
  
    if (existingValue) {
      existingValue.option = option;
      return this.taskOptionFieldValueRepository.save(existingValue);
    } else {
      const newValue = this.taskOptionFieldValueRepository.create({
        task,
        option
      });
      return this.taskOptionFieldValueRepository.save(newValue);
    } 
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

  private async getOrCreateNumberValue(taskId: number, fieldId: number, value: number): Promise<TaskFieldNumberValue> {
    let existingValue = await this.taskNumberFieldValueRepository.findOne({
      where: { task: { id: taskId }, taskField: { id: fieldId } }
    });

    if (existingValue) {
      existingValue.value = value;
      return this.taskNumberFieldValueRepository.save(existingValue);
    } else {
      const newNumberValue = new TaskFieldNumberValue();
      newNumberValue.task = { id: taskId } as Task;
      newNumberValue.taskField = { id: fieldId } as TaskField;
      newNumberValue.value = value;
      return this.taskNumberFieldValueRepository.save(newNumberValue);
    }
  }
 
  private async getOrCreateStringValue(taskId: number, fieldId: number, value: string): Promise<TaskFieldStringValue> {
    let existingValue = await this.taskStringFieldValueRepository.findOne({
      where: { task: { id: taskId }, taskField: { id: fieldId } }
    });

    if (existingValue) {
      existingValue.value = value;
      return this.taskStringFieldValueRepository.save(existingValue);
    } else {
      const newStringValue = new TaskFieldStringValue();
      newStringValue.task = { id: taskId } as Task;
      newStringValue.taskField = { id: fieldId } as TaskField;
      newStringValue.value = value;
      return this.taskStringFieldValueRepository.save(newStringValue);
    }
  }
}
