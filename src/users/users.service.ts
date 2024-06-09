import { Injectable } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService { 

    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User> ) {}  
    
    async create(dto: CreateUserDto) {
        const newUser = this.usersRepository.create(dto);
        await this.usersRepository.save(newUser); 
        return newUser; 
    }

    async getAll() {
        const users = await this.usersRepository.find(); 
        return users;
    }

    async getById(id: number){
        const user = await this.usersRepository.findOne({ where: { id } });
        return user;
    }
    
    async getByEmail(email: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        return user;
    }

    async remove(id: number) {
        const user = await this.getById(id);
        await this.usersRepository.remove(user);
    }
} 

