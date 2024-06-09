import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  
  @ApiProperty( {example: "email@mail.com", description: "email"} )
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 100)
  email: string;

  @ApiProperty( {example: "111111", description: "password"} )
  @IsString() 
  @Length(6, 20)
  password: string;
}