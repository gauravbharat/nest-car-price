import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.email, body.password);
  }

  // Below Route handlers are NOT required; created as an examples for typeORM working
  @Get()
  async findUser(@Query() query: { id?: string; email?: string }) {
    console.log('query', query);

    const id = query?.id;
    const email = query?.email;

    if (id) {
      const foundUser = await this.userService.findOne(+id);

      if (!foundUser) {
        throw new NotFoundException('user not found!');
      }
      return foundUser;
    }

    if (email) {
      const foundUsers = await this.userService.find(email);

      if (foundUsers.length === 0) {
        throw new NotFoundException('users not found!');
      }
      return foundUsers;
    }

    throw new BadRequestException();
  }
}
