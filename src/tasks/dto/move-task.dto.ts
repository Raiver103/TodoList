import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MoveTaskDto {
   
  @ApiProperty( {example: 1, description: "order"} ) 
  @IsNotEmpty()
  @IsNumber()
  order: number; 
}