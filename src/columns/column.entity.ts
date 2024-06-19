import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Project } from '../projects/project.entity';  
import { Task } from 'src/tasks/task.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ColumnEntity {
 
  @ApiProperty( { example: 1, description: "id" } )
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty( { example: "column", description: "name" } )
  @Column()
  name: string;

  @ApiProperty( { example: 1, description: "order" } )
  @Column()  
  order: number;

  @ApiProperty( { description: "project" } )
  @ManyToOne(() => Project, project => project.columns, { onDelete: 'CASCADE' })
  project: Project;

  @ApiProperty( { description: "tasks" } )
  @OneToMany(() => Task, task => task.column, { cascade: true, onDelete: 'CASCADE' })
  tasks: Task[]; 
}