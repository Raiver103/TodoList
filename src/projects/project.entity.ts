import { ApiProperty } from '@nestjs/swagger';
import { ColumnEntity } from 'src/columns/column.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'; 

@Entity()
export class Project {
  
  @ApiProperty( { example: 1, description: "id" } )
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty( { example: "project", description: "name" } )
  @Column()
  name: string;

  @ApiProperty( { example: "project description", description: "description" } )
  @Column()
  description: string;

  @ApiProperty( { example: "2024-06-08T09:36:59.955Z", description: "created at" } )
  @Column()
  createdAt: Date;

  @ApiProperty( { description: "user" } )
  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @ApiProperty( { description: "columns" } )
  @OneToMany(() => ColumnEntity, (column) => column.project, { cascade: true, onDelete: 'CASCADE' })
  columns: ColumnEntity[];
}