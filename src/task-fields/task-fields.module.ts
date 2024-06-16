import { Module, forwardRef } from '@nestjs/common';
import { TaskFieldsService } from './task-fields.service';
import { TaskFieldsController } from './task-fields.controller'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskField } from './entities/task-field.entity';
import { TaskFieldNumberValue } from './entities/task-field-number-value.entity';
import { TaskFieldStringValue } from './entities/task-field-string-value.entity';
import { Project } from 'src/projects/project.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from 'src/tasks/task.entity';

@Module({
  providers: [TaskFieldsService],
  controllers: [TaskFieldsController],
  imports:[ 
    TypeOrmModule.forFeature([TaskField, TaskFieldNumberValue, TaskFieldStringValue, Project, Task]),
    forwardRef(() => AuthModule),
  ],
  exports: [TaskFieldsService],
})
export class TaskFieldsModule {}
