import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto) // APPLIES TO ALL ROUTE HANDLERS
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   if ('userId' in session && typeof session.userId !== 'number') {
  //     throw new BadRequestException('bad request');
  //   }

  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  //   return this.userService.findOne(session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    if (!user) {
      throw new BadRequestException('bad request');
    }

    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    session.userId = user.id;
    return user;
  }

  /** Below Route handlers are NOT required;
   * created as examples for typeORM working
   */
  @Get('/:id')
  // @Serialize(UserDto) - CAN BE USED ON INDIVIDUAL ROUTE HANDLERS AS WELL
  async findUserById(@Param('id') id: string) {
    if (!id || isNaN(parseInt(id))) {
      throw new BadRequestException();
    }

    const foundUser = await this.userService.findOne(+id);

    if (!foundUser || !('id' in foundUser)) {
      throw new NotFoundException('user not found!');
    }
    return foundUser;
  }

  @Get()
  async findUser(@Query() query: { id?: string; email?: string }) {
    console.log('query', query);

    const id = query?.id;
    const email = query?.email;

    if (id) {
      const foundUser = await this.userService.findOne(parseInt(id));

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

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    try {
      // console.log('updateUser : body', body);
      const updatedUser = await this.userService.update(parseInt(id), body);
      return updatedUser;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException();
    }

    // return HttpStatus.OK;
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.userService.remove(parseInt(id));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException();
    }

    return { statusCode: HttpStatus.OK };
  }
}
