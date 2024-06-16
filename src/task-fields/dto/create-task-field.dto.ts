import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length } from 'class-validator'; 

enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
}

export class CreateTaskFieldDto {
  
  @ApiProperty( {example: "task field", description: "name"} ) 
  @Length(1, 100)
  @IsString()
  name: string;
  
  @ApiProperty( {example: "string", description: "type"} ) 
  @IsEnum(FieldType, { message: 'Type must be either "string" or "number"' })
  type: FieldType;
}