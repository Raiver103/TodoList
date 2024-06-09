import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  
  @ApiProperty( {example: "project", description: "name"} ) 
  @IsString() 
  @Length(1, 100)
  name: string;

  @ApiProperty( {example: "project description", description: "description"} )
  @IsString() 
  @Length(1, 300)
  description: string; 
}