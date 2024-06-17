import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm'; 
import { Task } from 'src/tasks/task.entity';
import { TaskField } from 'src/task-fields/entities/task-field.entity';

@Entity()
export class TaskFieldNumberValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, task => task.stringFieldValues, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => TaskField, taskField => taskField.stringValues, { onDelete: 'CASCADE' })
  taskField: TaskField;

  @Column({ type: 'float' }) 
  value: number;
}