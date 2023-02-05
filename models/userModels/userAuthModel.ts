import { ObjectId } from 'mongodb';
import { IUserAuth } from '../../util/interfaces/userInterfaces';
import UserAuthSchema from '../../util/database/schemas/users/userAuthSchema';
import mongoose from 'mongoose';

const UserAuthModel = mongoose.model('UserAuth', UserAuthSchema);

export default class UserAuthHandler implements IUserAuth {
  id: string | ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordChangedAt: Date;
  role: string;
  imageLink: string;

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, do not map
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  async save() {
    return await new UserAuthModel(this).save();
  }

  async update() {
    return await UserAuthModel.updateOne({ _id: this.id }, this);
  }

  static async fetchById(id: string | ObjectId): Promise<any> {
    return await UserAuthModel.findById(id);

  }

  static async fetchByEmail(email: string): Promise<any> {
    return await UserAuthModel.findOne({email});
  }

  static async fetchByResetToken(passwordResetToken: string) {
    return await UserAuthModel.findOne({passwordResetToken});
  }

  static async deleteById(id: string | ObjectId) {
    return await UserAuthModel.findByIdAndDelete(id);
  }
}


