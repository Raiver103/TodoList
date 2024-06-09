import { Module, forwardRef } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity'; 
import { AuthModule } from 'src/auth/auth.module'; 

@Module({
  providers: [ProjectsService],
  controllers: [ProjectsController],
  imports: [
    TypeOrmModule.forFeature([Project]), 
      forwardRef(() => AuthModule), 
  ],
  exports:[
    ProjectsService
  ]
})
export class ProjectsModule {}
 