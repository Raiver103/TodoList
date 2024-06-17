import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'; 
import { TaskFieldOption } from '../../task-fields/entities/task-field-option.entity';
import { Task } from 'src/tasks/task.entity';
import { TaskField } from '../../task-fields/entities/task-field.entity';

@Entity()
export class TaskFieldOptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, task => task.optionFieldValues, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => TaskFieldOption, option => option.optionValues, { onDelete: 'CASCADE' })
  option: TaskFieldOption;  
}