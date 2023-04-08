import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({ description: 'User registered successfully' })
  @ApiBody({ type: RegisterDTO })
  async register(@Body() RegisterDTO: RegisterDTO) {
    // inject appropritate service and handle logic here
    return 'register';
  }

  @Post('login')
  @ApiOkResponse({ description: 'Login success' })
  @ApiBody({ type: LoginDTO })
  async login(@Body() LoginDTO: LoginDTO) {
    // inject appropritate service and handle logic here
    return 'login';
  }
}
