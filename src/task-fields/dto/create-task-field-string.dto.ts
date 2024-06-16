import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator'; 

export class CreateTaskFieldStringDto {
  
  @ApiProperty( {example: "TaskFieldString", description: "value"} ) 
  @Length(1, 100)
  @IsString()
  value: string; 
}