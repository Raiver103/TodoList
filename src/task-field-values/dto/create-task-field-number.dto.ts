import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator'; 

export class CreateTaskFieldNumberDto {
  
  @ApiProperty( {example: 1, description: "Value"} )  
  @IsNumber()
  value: number; 
}