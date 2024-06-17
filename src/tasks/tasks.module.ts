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
import { TaskField } from 'src/task-fields/entities/task-field.entity';  
import { TaskFieldNumberValue } from 'src/task-field-values/entities/task-field-number-value.entity';
import { TaskFieldStringValue } from 'src/task-field-values/entities/task-field-string-value.entity';

@Module({
  providers: [TasksService],
  controllers: [TasksController],
  imports: [
    TypeOrmModule.forFeature([Task, ColumnEntity, Project, TaskField, TaskFieldNumberValue, TaskFieldStringValue,]),
    forwardRef(() => AuthModule),
    ProjectsModule, 
    ColumnsModule
  ],
  exports: [TasksService]
})
export class TasksModule {}
