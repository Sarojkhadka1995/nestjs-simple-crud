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
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Response } from 'express';

//PROVIDERS
import { UserService } from 'src/user/user.service';

//DTO
import { UpdateUserDto } from './dto/updateUser.dto';
import { GetAllUserDto } from './dto/getAllUser.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //Test route
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: 'Retrive success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  async test(@Res() response: Response) {
    try {
      return response.status(200).json(await this.userService.test());
    } catch (e) {
      throw new HttpException('No such user found', HttpStatus.BAD_REQUEST);
    }
  }

  //Fetch user list
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: 'Retrive success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  async getUsers(@Body() payload: GetAllUserDto, @Res() response: Response) {
    try {
      return response
        .status(200)
        .json(await this.userService.getAllUsers(payload));
    } catch (e) {
      throw new HttpException(e?.message, HttpStatus.BAD_REQUEST);
    }
  }

  //Update user by id
  @Put(':id')
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

  //Fetch user by id
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: 'Retrive success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  async getUserbyId(@Param('id') id: string, @Res() response: Response) {
    try {
      return response
        .status(HttpStatus.OK)
        .json(await this.userService.getUser(id));
    } catch (e) {
      throw new HttpException('No such user found', HttpStatus.BAD_REQUEST);
    }
  }
}
