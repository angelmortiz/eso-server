import { ObjectId } from 'mongodb';
import {
  IUserBasicInfo,
  IUserInfo,
} from '../../util/interfaces/userInterfaces';
import UserInfoSchema from '../../util/database/schemas/users/userInfoSchema';
import mongoose from 'mongoose';

const UserInfoModel = mongoose.model('UserInfo', UserInfoSchema);

export default class UserInfoHandler {

  static async save(user: IUserInfo) {
    return await new UserInfoModel(user).save();
  }

  static async update(_id: string | ObjectId, user: IUserInfo) {
    return await UserInfoModel.updateOne({ _id }, user);
  }

  static async fetchById(id: string | ObjectId): Promise<any> {
    return await UserInfoModel.findById(id);
  }

  static async fetchByUserAuthId(userAuthId: string | ObjectId): Promise<any> {
    return await UserInfoModel.findOne({userAuthId});
  }

  static async deleteById(id: string | ObjectId) {
    return await UserInfoModel.findByIdAndDelete(id);
  }
}
