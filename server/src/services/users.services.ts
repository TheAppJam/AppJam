import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ){}

  async create(userParams) {
    const { email, name, password } = userParams;

    const user = this.usersRepository.create({
      email,
      name,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    return this.usersRepository.save(user)
  }

  async findByEmail(email): Promise<User> {
    return await this.usersRepository.findOne({where: { email }})
  }
}