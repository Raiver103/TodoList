import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTaskFieldOptionDto {
  
  @ApiProperty( {example: 3, description: "option id"} )  
  @IsNumber()
  optionId: number; 
}