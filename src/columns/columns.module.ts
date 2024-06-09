import { Module, forwardRef } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnEntity } from './column.entity'; 
import { ProjectsModule } from 'src/projects/projects.module'; 
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ColumnsService],
  controllers: [ColumnsController],
  imports: [
    TypeOrmModule.forFeature([ColumnEntity]),
    forwardRef(() => AuthModule),
    ProjectsModule
  ],
  exports: [ColumnsService]
})
export class ColumnsModule {}
