import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

//PROVIDERS
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

//DTO
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOkResponse({ description: 'User registered successfully' })
  @ApiBody({ type: RegisterDTO })
  async register(@Body() RegisterDTO: RegisterDTO, @Res() response: Response) {
    try {
      const user = await this.userService.create(RegisterDTO);
      return response
        .status(HttpStatus.OK)
        .json({ user, messgae: 'User registered' });
    } catch (e) {
      throw new HttpException("Couldn't register user", HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @ApiOkResponse({ description: 'Login success' })
  @ApiBody({ type: LoginDTO })
  async login(@Body() payload: LoginDTO, @Res() response: Response) {
    try {
      const user = await this.userService.login(payload);
      const token = await this.authService.signPayload({
        email: payload?.email,
      });
      return response.status(HttpStatus.OK).json({ user, token });
    } catch (e) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ Message: 'Email or password incorrect' });
    }
  }
}
