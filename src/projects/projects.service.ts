import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create( user: User, createProjectDto: CreateProjectDto) { 
    const project = this.projectsRepository.create({ ...createProjectDto, user, createdAt: new Date() });
    return this.projectsRepository.save(project);
  }

  async getAll(user: User) {
    const projects = await this.projectsRepository
      .createQueryBuilder('project')
      .where('project.userId = :userId', { userId: user.id })
      .leftJoinAndSelect('project.columns', 'column')
      .leftJoinAndSelect('column.tasks', 'task')
      .leftJoinAndSelect('task.stringFieldValues', 'stringFieldValue')
      .leftJoinAndSelect('stringFieldValue.taskField', 'stringTaskField')
      .leftJoinAndSelect('task.numberFieldValues', 'numberFieldValue')
      .leftJoinAndSelect('numberFieldValue.taskField', 'numberTaskField')
      .leftJoinAndSelect('task.optionFieldValues', 'optionFieldValue')
      .leftJoinAndSelect('optionFieldValue.option', 'option')
      .leftJoinAndSelect('option.taskField', 'optionTaskField')
      .getMany();
    
    return projects;
  }

  async getOne(user: User, id: number) {
    const project = await this.projectsRepository
      .createQueryBuilder('project')
      .where('project.id = :id', { id })
      .andWhere('project.userId = :userId', { userId: user.id })
      .leftJoinAndSelect('project.columns', 'column')
      .leftJoinAndSelect('column.tasks', 'task')
      .leftJoinAndSelect('task.stringFieldValues', 'stringFieldValue')
      .leftJoinAndSelect('stringFieldValue.taskField', 'stringTaskField')
      .leftJoinAndSelect('task.numberFieldValues', 'numberFieldValue')
      .leftJoinAndSelect('numberFieldValue.taskField', 'numberTaskField')
      .leftJoinAndSelect('task.optionFieldValues', 'optionFieldValue')
      .leftJoinAndSelect('optionFieldValue.option', 'option')
      .leftJoinAndSelect('option.taskField', 'optionTaskField')
      .getOne();
  
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }
  
    return project;
  }

  async update(user: User, updateData: CreateProjectDto, id: number) {
    const project = await this.getOne(user, id); 
    Object.assign(project, updateData);
    return this.projectsRepository.save(project);
  }

  async remove(user: User, id: number)  {
    const project = await this.getOne(user, id);
    await this.projectsRepository.remove(project);
  }
}
