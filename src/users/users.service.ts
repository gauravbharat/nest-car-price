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
    // since those methods are made to be used with plain objects!!
  }

  find(email: string) {
    // returns an array with or without records
    return this.repo.find({ where: { email } });
  }

  findOne(id: number) {
    // returns an object
    return this.repo.findOneBy({ id });
  }

  // used Partial so the update body can have all, some or none of the User properties
  async update(id: number, attrs: Partial<User>) {
    // Instead of update() method, which is designed to be used with an object INSTEAD of an entity,
    // save() is used because we want any Entity Hooks to be executed
    // that are available in the User Entity class.
    const user = await this.findOne(id);

    if (!user) {
      // throwing a NotFoundException here could be caught by the HTTP protocol controller, however,
      // WebSocket and GRPC may not understand how to handle the exception.
      throw new Error('user not found');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    // Instead of delete() method, which is designed to be used with an object INSTEAD of an entity,
    // remove() is used because we want any Entity Hooks to be executed

    const user = await this.findOne(id);

    if (!user) {
      // throwing a NotFoundException here could be caught by the HTTP protocol controller, however,
      // WebSocket and GRPC may not understand how to handle the exception.
      throw new Error('user not found');
    }

    return this.repo.remove(user);
  }
}
