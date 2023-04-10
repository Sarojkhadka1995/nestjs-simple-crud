import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const CatSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});

export const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String },
  createdAt: {
    type: Date,
    default: function () {
      return Date.now();
    },
  },
  updatedAt: { type: Date },
  lastloginDate: { type: Date },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
