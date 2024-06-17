import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator'; 

export class CreateTaskFieldNumberDto {
  
  @ApiProperty( {example: 3, description: "value"} )  
  @IsNumber()
  value: number; 
}