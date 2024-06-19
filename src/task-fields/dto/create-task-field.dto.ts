import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, Length } from 'class-validator'; 

enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  OPTION = 'option',
}

export class CreateTaskFieldDto {
  
  @ApiProperty( {example: "task field", description: "name"} ) 
  @Length(1, 100)
  @IsString()
  name: string;
  
  @ApiProperty( {example: "option", description: "type"} ) 
  @IsEnum(FieldType, { message: 'Type must be either "string", "number" or "option"' })
  type: FieldType;

  @ApiProperty( {example: ["option 1", "option 2", "option 3"], description: "options"} ) 
  @IsOptional()
  @IsArray()
  options?: string[];
}