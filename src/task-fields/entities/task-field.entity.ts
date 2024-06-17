import { Project } from 'src/projects/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';   
import { TaskFieldOption } from './task-field-option.entity';
import { TaskFieldStringValue } from 'src/task-field-values/entities/task-field-string-value.entity';
import { TaskFieldNumberValue } from 'src/task-field-values/entities/task-field-number-value.entity';

@Entity()
export class TaskField {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, project => project.fields, { onDelete: 'CASCADE' })
  project: Project;

  @Column()
  name: string;

  @Column()
  type: 'string' | 'number' | 'option'; 

  @OneToMany(() => TaskFieldStringValue, stringValue => stringValue.taskField)
  stringValues: TaskFieldStringValue[];

  @OneToMany(() => TaskFieldNumberValue, numberValue => numberValue.taskField)
  numberValues: TaskFieldNumberValue[];

  @OneToMany(() => TaskFieldOption, option => option.taskField)
  options: TaskFieldOption[];
}