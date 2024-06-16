import { Project } from 'src/projects/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';  
import { TaskFieldStringValue } from './task-field-string-value.entity';
import { TaskFieldNumberValue } from './task-field-number-value.entity';

@Entity()
export class TaskField {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, project => project.fields, { onDelete: 'CASCADE' })
  project: Project;

  @Column()
  name: string;

  @Column()
  type: 'string' | 'number'; 

  @OneToMany(() => TaskFieldStringValue, stringValue => stringValue.taskField)
  stringValues: TaskFieldStringValue[];

  @OneToMany(() => TaskFieldNumberValue, numberValue => numberValue.taskField)
  numberValues: TaskFieldNumberValue[];
}