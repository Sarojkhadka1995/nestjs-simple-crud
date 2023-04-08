import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  test() {
    return { message: 'This is test from user ' };
  }
}
