import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TaskField } from './task-field.entity'; 
import { Task } from 'src/tasks/task.entity';

@Entity()
export class TaskFieldStringValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, task => task.stringFieldValues, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => TaskField, taskField => taskField.stringValues, { onDelete: 'CASCADE' })
  taskField: TaskField;

  @Column()
  value: string;
}