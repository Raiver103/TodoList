import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ColumnType } from 'typeorm';
import { ColumnEntity } from '../columns/column.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Task {
  
  @ApiProperty( { example: 1, description: "id" } )
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty( { example: "task", description: "name" } )
  @Column()
  name: string;

  @ApiProperty( { example: "task description", description: "description" } )
  @Column()
  description: string;

  @ApiProperty( { example: "2024-06-08T09:36:59.955Z", description: "created at" } )
  @Column()
  createdAt: Date;

  @ApiProperty( { example: 3, description: "order" } )
  @Column()  
  order: number;
  
  @ApiProperty( { description: "column" } )
  @ManyToOne(() => ColumnEntity, column => column.tasks, { onDelete: 'CASCADE' })
  column: ColumnEntity;
} 