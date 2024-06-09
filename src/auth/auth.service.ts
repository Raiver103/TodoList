import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto'; 
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
    
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) { }

  async login(userDto: CreateUserDto) {
      const user = await this.validateUser(userDto)
      return this.generateToken(user)
  }

  async registration(userDto: CreateUserDto) {
      const candidate = await this.userService.getByEmail(userDto.email);
      if (candidate) {
          throw new HttpException('User with such email exists', HttpStatus.BAD_REQUEST);
      }
      const hashPassword = await bcrypt.hash(userDto.password, 5);
      const user = await this.userService.create( {...userDto, password: hashPassword} )
      return this.generateToken(user)
  }

  private async generateToken(user: User) {
      const payload = {email: user.email, id: user.id}
      return {
          token: this.jwtService.sign(payload)
      }
  }

  private async validateUser(userDto: CreateUserDto) {
      const user = await this.userService.getByEmail(userDto.email);
      const passwordEquals = await bcrypt.compare(userDto.password, user.password);
      if (user && passwordEquals) {
          return user;
      }
      throw new UnauthorizedException({message: 'Incorrect email or password'})
  }
} 