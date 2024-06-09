import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { ProjectsService } from 'src/projects/projects.service'; 
import { CreateColumnDto } from './dto/create-column.dto';
import { User } from 'src/users/user.entity';  

@Injectable()
export class ColumnsService {

  constructor(
    @InjectRepository(ColumnEntity)
    private columnsRepository: Repository<ColumnEntity>,
    private projectsService: ProjectsService 
  ) {}

  async create(user: User, projectId: number, column: CreateColumnDto)  {
    
    const project = await this.projectsService.getOne(user, projectId);
    column.order = project.columns.length + 1; 
    const newColumn = this.columnsRepository.create({ ...column, project });  
    return this.columnsRepository.save(newColumn);
  }

  async update(user: User, projectId: number, columnId: number, updateColumnDto: CreateColumnDto) {

    const column = await this.getOne(user, projectId, columnId);
    Object.assign(column, updateColumnDto);
    return this.columnsRepository.save(column);
  }

  async getOne(user: User, projectId: number, columnId: number) { 

    const column = await this.columnsRepository.findOne({
      where: {
        id: columnId,
        project: {
          id: projectId,
          user: {
            id: user.id,
          },
        },
      },
      relations: ['project', 'project.user'],
    }); 
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    return column;
  }
 
  async remove(user: User, projectId: number, columnId: number) {

    const column = await this.getOne(user, projectId, columnId);
    await this.columnsRepository.remove(column);

    // update all column's order of the project
    const project = column.project;
    const remainingColumns = await this.columnsRepository.find({
      where: { project: project },
      order: { order: 'ASC' },
    });

    for (let i = 0; i < remainingColumns.length; i++) {
      remainingColumns[i].order = i + 1;
      await this.columnsRepository.save(remainingColumns[i]);
    }
  }

  async move(user: User, projectId: number, columnId: number, newOrder: number)  {
    
    const column = await this.getOne(user, projectId, columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    // Get all the columns in the project, except for the moved one
    const otherColumns = await this.columnsRepository.find({
      where: { project: column.project, id: Not(columnId) },
      order: { order: 'ASC' },
    }); 

    if(newOrder < 1 || newOrder > otherColumns.length + 1){
      throw new ForbiddenException(`bad range`); 
    }

    // If the new sequence number is smaller than the current one, increase the sequence numbers of the columns that should move to the right
    if (newOrder < column.order) {
      for (const otherColumn of otherColumns) {
        if (otherColumn.order >= newOrder && otherColumn.order < column.order) {
          otherColumn.order++;
          await this.columnsRepository.save(otherColumn);
        }
      }
    } else {
      // If the new sequence number is larger than the current one, reduce the sequence numbers of the columns that should move to the left
      for (const otherColumn of otherColumns) {
        if (otherColumn.order > column.order && otherColumn.order <= newOrder) {
          otherColumn.order--;
          await this.columnsRepository.save(otherColumn);
        }
      }
    }

    // Setting a new sequence number for the column to be moved
    column.order = newOrder;
    await this.columnsRepository.save(column);
  }
}
