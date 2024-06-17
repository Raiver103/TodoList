import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';  
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module'; 
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';
import { Project } from './projects/project.entity';
import { ColumnEntity } from './columns/column.entity';
import { Task } from './tasks/task.entity';
import { TaskFieldsModule } from './task-fields/task-fields.module';
import { TaskField } from './task-fields/entities/task-field.entity'; 
import { TaskFieldOption } from './task-fields/entities/task-field-option.entity';
import { TaskFieldOptionValue } from './task-field-values/entities/task-field-option-value.entity';
import { TaskFieldValuesModule } from './task-field-values/task-field-values.module';
import { TaskFieldNumberValue } from './task-field-values/entities/task-field-number-value.entity';
import { TaskFieldStringValue } from './task-field-values/entities/task-field-string-value.entity';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }), 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Project, ColumnEntity, Task,
        TaskField, 
        TaskFieldNumberValue, 
        TaskFieldStringValue, 
        TaskFieldOption, 
        TaskFieldOptionValue, 
      ], 
      synchronize: true,
      autoLoadEntities: true,
    }),   
    UsersModule, ProjectsModule, AuthModule, ColumnsModule, TasksModule, TaskFieldsModule, TaskFieldValuesModule
  ]  
})
export class AppModule { 
}  
 