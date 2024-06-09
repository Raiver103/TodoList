import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')

export class AuthController {
    
  constructor(private authService: AuthService) { }

  @ApiOperation({ summary:"Login" })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
      return this.authService.login(userDto)
  }

  @ApiOperation({ summary:"Registration" })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
      return this.authService.registration(userDto)
  }
} 