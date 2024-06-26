import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskField } from './entities/task-field.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity'; 
import { TaskFieldOption } from './entities/task-field-option.entity';

@Injectable()
export class TaskFieldsService {
  constructor(
    @InjectRepository(TaskField)
    private taskFieldsRepository: Repository<TaskField>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>, 
    @InjectRepository(TaskFieldOption)
    private taskFieldOptionRepository: Repository<TaskFieldOption>,
  ) {}
  
  async create(user: User, projectId: number, name: string, type: 'string' | 'number' | 'option', options?: string[]) {
    const project = await this.projectsRepository.findOne({ where: { id: projectId }, 
      relations: ['user'] });

    this.isProjectNull(project);  

    if (project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to add fields to this project');
    }

    const taskField = this.taskFieldsRepository.create({ project, name, type });
    const savedField = await this.taskFieldsRepository.save(taskField);

    await this.saveTaskFieldOptions(type, options, savedField);

    return savedField;
  }

  async update(user: User, fieldId: number, name: string, type: 'string' | 'number' | 'option', options?: string[]) {
    const taskField = await this.taskFieldsRepository.findOne({ where: { id: fieldId }, 
      relations: ['project', 'project.user', 'options'] });

    this.isTaskFieldNull(taskField); 
    
    if (taskField.project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to update this task field');
    }

    taskField.name = name; 
    taskField.type = type;

    const updatedField = await this.taskFieldsRepository.save(taskField);
 
    await this.saveTaskFieldOptions(type, options, updatedField);

    return updatedField;
  }

  async delete(user: User, fieldId: number) {
    const taskField = await this.taskFieldsRepository.findOne({ where: { id: fieldId }, 
      relations: ['project', 'project.user'] });
 
    this.isTaskFieldNull(taskField); 

    if (taskField.project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to add values to this task field');
    }

    await this.taskFieldsRepository.remove(taskField);
  }

  async findAll(user: User, projectId: number) {
    const project = await this.projectsRepository.findOne({ where: { id: projectId }, 
      relations: ['user'] });
 
    this.isProjectNull(project);  

    if (project.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to add values to this task field');
    }
    
    return this.taskFieldsRepository.find({ where: { project } });
  }

  private async saveTaskFieldOptions(type: string, options: string[], savedField: TaskField) {
    if (type === 'option' && options) {
      const optionEntities = options.map(option => {
        const optionEntity = new TaskFieldOption();
        optionEntity.taskField = savedField;
        optionEntity.value = option;
        return optionEntity;
      });
      await this.taskFieldOptionRepository.save(optionEntities);
    }
  }

  private isProjectNull(project: Project) {
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }

  private isTaskFieldNull(taskField: TaskField) {
    if (!taskField) {
      throw new NotFoundException('Task field not found');
    }
  }

}
