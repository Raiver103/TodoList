import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common'; 
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard)
@ApiTags("Users")
@Controller('users')    
export class UsersController {
      
    constructor(private usersService: UsersService) { }
 
    @ApiOperation( { summary:"Create user" } ) 
    @Post() 
    createUser(@Body() userDto: CreateUserDto){ 
        return this.usersService.create(userDto);
    }
 
    @ApiOperation( { summary:"Get users" } ) 
    @Get()  
    getAllUsers(){
        return this.usersService.getAll();
    }
    
    @ApiOperation( { summary:"Get user by id" } ) 
    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.usersService.getById(+id);
    }   

    @ApiOperation( { summary:"Get user by email" } ) 
    @Get('email/:email')
    getUserByEmail(@Param('email') email: string) {
        const user = this.usersService.getByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
        
    @ApiOperation( { summary:"Delete user" } ) 
    @Delete(':id')
    removeUser(@Param('id') id: string) {  
        return this.usersService.remove(+id);
    }  
}
