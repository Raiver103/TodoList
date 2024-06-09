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
      entities: [User, Project, ColumnEntity, Task], 
      synchronize: true,
      autoLoadEntities: true,
    }),   
    UsersModule, ProjectsModule, AuthModule, ColumnsModule, TasksModule
  ] 
})
export class AppModule { 
}  
