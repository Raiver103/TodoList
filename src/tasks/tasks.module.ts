import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { ColumnsModule } from 'src/columns/columns.module';
import { ColumnEntity } from 'src/columns/column.entity';
import { Project } from 'src/projects/project.entity';

@Module({
  providers: [TasksService],
  controllers: [TasksController],
  imports: [
    TypeOrmModule.forFeature([Task, ColumnEntity, Project]),
    forwardRef(() => AuthModule),
    ProjectsModule, 
    ColumnsModule
  ],
  exports: [TasksService]
})
export class TasksModule {}
