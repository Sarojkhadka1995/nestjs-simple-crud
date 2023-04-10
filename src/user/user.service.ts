import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//DB
import { Model } from 'mongoose';

//INTERFACES
import { User } from 'src/user/interfaces/user';

//DTO
import { GetAllUserDto } from './dto/getAllUser.dto';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginDTO } from 'src/auth/dto/login.dto';

//THIRD PARTY PACAKGES
import * as bcrypt from 'bcrypt';
import { signPayload } from 'src/auth/interfaces/signPayload';

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

  async getAllUsers(payload: GetAllUserDto) {
    const LIMIT = payload?.limit;
    const skipCollection = payload?.page
      ? (Number(payload?.page) - 1) * LIMIT
      : 0;
    let nextPage = false;
    try {
      const userData = await this.userModel
        .find()
        .sort({ createdAt: 'desc' })
        .skip(skipCollection)
        .limit(LIMIT)
        .lean()
        .exec();
      if (userData.length > 0) {
        const skipCollectionNext = payload?.page
          ? Number(payload?.page) * LIMIT
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
      throw new NotFoundException('User not found');
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

  async login(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await this.userModel.find({ email: UserDTO.email });
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user[0].password)) {
      await this.userModel.findOneAndUpdate(
        { email: email },
        { lastloginDate: new Date() },
        { new: true },
      );
      return this.sanitizeUser(user[0]);
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(payload: UpdateUserDto, userID: string) {
    return { message: 'it works', userID, payload };
  }

  async test() {
    return { message: 'it works' };
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async findByPayload(payload: signPayload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }
}
