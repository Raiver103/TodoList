import { Module, forwardRef } from '@nestjs/common';
import { TaskFieldsService } from './task-fields.service';
import { TaskFieldsController } from './task-fields.controller'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskField } from './entities/task-field.entity'; 
import { Project } from 'src/projects/project.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from 'src/tasks/task.entity';
import { TaskFieldOption } from './entities/task-field-option.entity';
import { TaskFieldOptionValue } from '../task-field-values/entities/task-field-option-value.entity'; 

@Module({
  providers: [TaskFieldsService],
  controllers: [TaskFieldsController],
  imports:[ 
    TypeOrmModule.forFeature([
      TaskField,  
      TaskFieldOption,  
      Project, 
      Task
    ]),
    forwardRef(() => AuthModule),
  ],
  exports: [TaskFieldsService],
})
export class TaskFieldsModule {}
