import { Injectable } from '@nestjs/common';
//INTERFACES
import { signPayload } from './interfaces/signPayload';

//JWT
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async signPayload(payload: signPayload) {
    return await sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
  }

  async validateUser(payload: signPayload) {
    return await this.userService.findByPayload(payload);
  }
}
