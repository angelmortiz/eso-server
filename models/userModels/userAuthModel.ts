import { ObjectId } from 'mongodb';
import { IUserAuth } from '../../util/interfaces/userInterfaces';
import UserAuthSchema from '../../util/database/schemas/users/userAuthSchema';
import mongoose from 'mongoose';

const UserAuthModel = mongoose.model('UserAuth', UserAuthSchema);

export default class UserAuthHandler {
  static async save(user: IUserAuth) {
    return await new UserAuthModel(user).save();
  }

  static async update(_id: string | ObjectId, user: IUserAuth) {
    return await UserAuthModel.updateOne({ _id }, user);
  }

  static async fetchById(id: string | ObjectId): Promise<any> {
    return await UserAuthModel.findById(
      id,
      'firstName lastName fullName email role imageLink'
    ).populate('userInfo');
  }

  static async fetchByEmail(email: string): Promise<any> {
    return await UserAuthModel.findOne({ email });
  }

  static async fetchByResetToken(passwordResetToken: string) {
    return await UserAuthModel.findOne({ passwordResetToken });
  }

  static async fetchAllNames() {
    return await UserAuthModel.find({}, 'fullName');
  }

  static async deleteById(id: string | ObjectId) {
    return await UserAuthModel.findByIdAndDelete(id);
  }
}
