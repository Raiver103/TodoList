import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ColumnType } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from 'src/projects/project.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User{

  @ApiProperty( { example: 1, description: "id" } )
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty( {example: "youremail@mail.com", description: "email"} )
  @Column()
  email: string;

  @ApiProperty( {example: "111111", description: "password"} )
  @Column() 
  @Exclude()
  password: string; 

  @ApiProperty( { description: "projects"} )
  @OneToMany(() => Project, project => project.user, { cascade: true, onDelete: 'CASCADE' })
  projects: Project[]; 
}