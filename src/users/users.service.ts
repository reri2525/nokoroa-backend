import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponse } from './interfaces/create-user-response.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const hashedPassword = await hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
      },
    });

    const { password: _password, ...userWithoutPassword } = user;
    return {
      message: 'ユーザーが正常に作成されました',
      user: userWithoutPassword,
    };
  }
}
