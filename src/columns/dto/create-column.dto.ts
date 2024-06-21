import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateColumnDto {
  
  @ApiProperty( {example: "column", description: "name"} ) 
  @IsString() 
  @Length(1, 100)
  name: string; 
}