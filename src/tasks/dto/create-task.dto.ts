import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator'; 

export class CreateTaskDto {
  
  @ApiProperty( {example: "task", description: "name"} ) 
  @Length(1, 100)
  @IsString()
  name: string;
  
  @ApiProperty( {example: "task description", description: "description"} )
  @Length(1, 300)
  @IsString()
  description: string; 

  stringFields: any;
  numberFields: any; 
  optionFields: any;
 
}