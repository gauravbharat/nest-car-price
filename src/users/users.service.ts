import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(email: string, password: string) {
    // creates a User Entity instance;
    // does not persist or save any information in the database
    const user = this.repo.create({ email, password });

    // Saves the User Entity instance to the database
    // The save method can be passed an object directly with email and password, HOWEVER,
    // any hooks in the User Entity WILL NOT be executed.
    return this.repo.save(user);

    // save() vs insert() /update() methods, OR
    // remove() vs delete() method:
    // with the later, any entity HOOKS are NOT executed
  }
}
