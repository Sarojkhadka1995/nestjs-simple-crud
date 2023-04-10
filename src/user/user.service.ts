import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/interfaces/user';

import { GetAllUserDto } from './dto/getAllUser.dto';
import { LogoutDTO } from './dto/logout.dto';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') public userModel: Model<User>) {}

  async create(RegisterDTO: RegisterDTO) {
    const { email } = RegisterDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(RegisterDTO);
    await createdUser.save();
    await this.userModel.findOneAndUpdate(
      { email: email },
      { userName: RegisterDTO.firstName + ' ' + RegisterDTO.lastName },
      { new: true },
    );
    return this.sanitizeUser(createdUser);
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async findAllUsers(payload: GetAllUserDto) {
    const LIMIT = payload?.limit;
    const skipCollection = payload?.page ? Number(payload?.page) * LIMIT : 0;
    let nextPage = false;
    try {
      let userData = await this.userModel
        .find()
        .sort({ createdAt: 'desc' })
        .skip(skipCollection)
        .limit(LIMIT)
        .lean()
        .exec();
      if (userData.length > 0) {
        const skipCollectionNext = payload?.page
          ? (Number(payload?.page) + 1) * LIMIT
          : 0;
        const nextPageData = await this.userModel
          .find()
          .skip(skipCollectionNext)
          .limit(LIMIT)
          .lean()
          .exec();
        if (nextPageData.length > 0) {
          nextPage = true;
        }
        userData = userData.slice(skipCollection, skipCollection + LIMIT);
        return {
          data: userData,
          page: Number(payload?.page),
          limit: payload?.limit,
          count: userData?.length,
          next: nextPage,
        };
      } else {
        return {
          data: userData,
          page: Number(payload?.page),
          limit: payload?.limit,
          count: userData?.length,
          next: nextPage,
        };
      }
    } catch (e) {
      throw new NotFoundException('Admin users not found');
    }
  }

  async getUser(userId: any) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new HttpException('User doesnt exist', HttpStatus.BAD_REQUEST);
    } else {
      return user;
    }
  }

  async logOut(data: LogoutDTO) {
    const user = await this.userModel.findOne({ _id: data.userId });
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    } else {
      try {
        await this.userModel.findOneAndUpdate(
          { _id: data.userId },
          { verifyToken: '', passwordChanged: 'LoggedOut' },
          { new: true },
        );
      } catch (e) {
        throw new HttpException(
          'Token doesnt exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
  }

  async updateUser(payload: UpdateUserDto, userID: string) {
    return { message: 'it works', userID, payload };
  }
}
