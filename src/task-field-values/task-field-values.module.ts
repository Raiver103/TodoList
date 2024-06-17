import { Module, forwardRef } from '@nestjs/common';
import { TaskFieldValuesService } from './task-field-values.service';
import TaskFieldValuesController from './task-field-values.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AuthModule } from 'src/auth/auth.module';
import { Task } from 'src/tasks/task.entity';
import { TaskField } from 'src/task-fields/entities/task-field.entity';
import { TaskFieldOption } from 'src/task-fields/entities/task-field-option.entity'; 
import { TaskFieldOptionValue } from './entities/task-field-option-value.entity';
import { TaskFieldNumberValue } from './entities/task-field-number-value.entity';
import { TaskFieldStringValue } from './entities/task-field-string-value.entity';

@Module({
  providers: [TaskFieldValuesService],
  controllers: [TaskFieldValuesController],
  imports:[ 
    TypeOrmModule.forFeature([ 
      TaskFieldNumberValue, 
      TaskFieldStringValue, 
      TaskFieldOptionValue,  
      Task,
      TaskField,
      TaskFieldOption
    ]),
    forwardRef(() => AuthModule),
  ],
})
export class TaskFieldValuesModule {}
