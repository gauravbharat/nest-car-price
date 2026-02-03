import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if this email already in use. If it is, return an error
    const foundUser = await this.usersService.find(email);

    if (foundUser.length) {
      throw new BadRequestException('email in use');
    }

    // Encrypt the user's password

    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // console.log('signup salt', salt);
    // Hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and salt together
    const result = salt + '.' + hash.toString('hex');
    // console.log('signup hashed result', result);
    // Store the new user record
    const user = await this.usersService.create(email, result);
    // Send back a cookie that contains the user's id

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}
