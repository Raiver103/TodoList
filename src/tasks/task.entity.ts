import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ColumnType, OneToMany } from 'typeorm';
import { ColumnEntity } from '../columns/column.entity';
import { ApiProperty } from '@nestjs/swagger'; 
import { TaskFieldStringValue } from 'src/task-fields/entities/task-field-string-value.entity';
import { TaskFieldNumberValue } from 'src/task-fields/entities/task-field-number-value.entity';

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
 
  @OneToMany(() => TaskFieldStringValue, stringValue => stringValue.task)
  stringFieldValues: TaskFieldStringValue[];

  @OneToMany(() => TaskFieldNumberValue, numberValue => numberValue.task)
  numberFieldValues: TaskFieldNumberValue[];
} 