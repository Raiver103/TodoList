import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTaskFieldOptionDto {
  
  @ApiProperty( {example: 1, description: "Option id"} )  
  @IsNumber()
  optionId: number; 
}