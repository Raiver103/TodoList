import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { TaskField } from './task-field.entity'; 
import { TaskFieldOptionValue } from '../../task-field-values/entities/task-field-option-value.entity';

@Entity()
export class TaskFieldOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TaskField, taskField => taskField.options, { onDelete: 'CASCADE' })
  taskField: TaskField;

  @Column()
  value: string;

  @OneToMany(() => TaskFieldOptionValue, optionValue => optionValue.option)
  optionValues: TaskFieldOptionValue[];
}