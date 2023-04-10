import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Param,
  HttpStatus,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updateUser.dto';
import { GetAllUserDto } from './dto/getAllUser.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: 'Retive success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  async getUsers(@Body() payload: GetAllUserDto, @Res() response: Response) {
    try {
      return response
        .status(200)
        .json(await this.userService.findAllUsers(payload));
    } catch (e) {
      throw new HttpException('No such user found', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('users:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: 'Retrive success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  async users(
    @Body() updatePayload: UpdateUserDto,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    return response
      .status(200)
      .json(await this.userService.updateUser(updatePayload, id));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: 'Retrive success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  async getUserbyId(@Param('id') id: string) {
    try {
      return await this.userService.getUser(id);
    } catch (e) {
      throw new HttpException('No such user found', HttpStatus.BAD_REQUEST);
    }
  }
}
