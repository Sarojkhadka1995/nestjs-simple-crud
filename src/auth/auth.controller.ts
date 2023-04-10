import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';

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
  async login(@Body() LoginDTO: LoginDTO) {
    // inject appropritate service and handle logic here
    return 'login';
  }
}
