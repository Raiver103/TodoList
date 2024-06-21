import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
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
    const newColumn = this.columnsRepository.create({ ...column, project });  
    newColumn.order = project.columns.length + 1; 
    return this.columnsRepository.save(newColumn);
  }

  async update(user: User, projectId: number, columnId: number, updateColumnDto: CreateColumnDto) {

    const column = await this.getOne(user, projectId, columnId);
    Object.assign(column, updateColumnDto);
    return this.columnsRepository.save(column);
  }
 
  async remove(user: User, projectId: number, columnId: number) {

    const column = await this.getOne(user, projectId, columnId); 
    await this.columnsRepository.remove(column);
 
    await this.updateOrdersOfProjectAfterRemove(column);
  }

  async move(user: User, projectId: number, columnId: number, newOrder: number)  {
    
    const column = await this.getOne(user, projectId, columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }
 
    const otherColumns = await this.columnsExceptMovedColumn(column, columnId); 

    if(newOrder < 1 || newOrder > otherColumns.length + 1){
      throw new ForbiddenException(`bad range`); 
    }

    await this.updateColumnsOrder(newOrder, column, otherColumns);

    column.order = newOrder;

    await this.columnsRepository.save(column);
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

  private async updateOrdersOfProjectAfterRemove(column: ColumnEntity) {
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

  private async updateColumnsOrder(newOrder: number, column: ColumnEntity, otherColumns: ColumnEntity[]) {
    if (newOrder < column.order) {
      for (const otherColumn of otherColumns) {
        if (otherColumn.order >= newOrder && otherColumn.order < column.order) {
          otherColumn.order++;
          await this.columnsRepository.save(otherColumn);
        }
      }
    } else {
      for (const otherColumn of otherColumns) {
        if (otherColumn.order > column.order && otherColumn.order <= newOrder) {
          otherColumn.order--;
          await this.columnsRepository.save(otherColumn);
        }
      }
    }
  }

  private async columnsExceptMovedColumn(column: ColumnEntity, columnId: number) {
    return await this.columnsRepository.find({
      where: { project: column.project, id: Not(columnId) },
      order: { order: 'ASC' },
    });
  }
}
