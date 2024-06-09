import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MoveColumnDto {
   
  @ApiProperty( {example: 1, description: "order"} ) 
  @IsNotEmpty()
  order: number; 
}