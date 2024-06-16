import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskField } from './entities/task-field.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity';
import { TaskFieldNumberValue } from './entities/task-field-number-value.entity';
import { TaskFieldStringValue } from './entities/task-field-string-value.entity';
import { Task } from 'src/tasks/task.entity';

@Injectable()
export class TaskFieldsService {
  constructor(
    @InjectRepository(TaskField)
    private taskFieldsRepository: Repository<TaskField>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(TaskFieldNumberValue)
    private taskNumericFieldValueRepository: Repository<TaskFieldNumberValue>,
    @InjectRepository(TaskFieldStringValue)
    private taskStringFieldValueRepository: Repository<TaskFieldStringValue>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
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

  async create(user: User, projectId: number, name: string, type: 'string' | 'number') {
    const project = await this.projectsRepository.findOne({ where: { id: projectId }, 
      relations: ['user'] });

    if (!project) {
      throw new NotFoundException('Project not found');
    }  

    if (project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to add fields to this project');
    }

    const taskField = this.taskFieldsRepository.create({ project, name, type });
    return this.taskFieldsRepository.save(taskField);
  }

  async update(user: User, fieldId: number, name: string, type: 'string' | 'number') {
    const taskField = await this.taskFieldsRepository.findOne({ where: { id: fieldId }, 
      relations: ['project', 'project.user'] });

    if (!taskField) {
      throw new NotFoundException('Task field not found');
    } 
    
    if (taskField.project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to add values to this task field');
    }

    taskField.name = name; 
    taskField.type = type;

    return this.taskFieldsRepository.save(taskField);
  }

  async delete(user: User, fieldId: number) {
    const taskField = await this.taskFieldsRepository.findOne({ where: { id: fieldId }, 
      relations: ['project', 'project.user'] });

    if (!taskField) {
      throw new NotFoundException('Task field not found');
    } 

    if (taskField.project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to add values to this task field');
    }

    await this.taskFieldsRepository.remove(taskField);
  }

  async findAll(user: User, projectId: number) {
    const project = await this.projectsRepository.findOne({ where: { id: projectId }, 
      relations: ['user'] });

    if (!project) {
      throw new NotFoundException('Project not found');
    } 

    if (project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to add values to this task field');
    }
    
    return this.taskFieldsRepository.find({ where: { project } });
  }
}
