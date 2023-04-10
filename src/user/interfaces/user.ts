import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  lastloginDate: Date;
  status: string;
  firstName: string;
  lastName: string;
}
