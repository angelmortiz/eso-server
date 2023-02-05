import { ObjectId } from 'mongodb';
import {
  IUserBasicInfo,
  IUserInfo,
} from '../../util/interfaces/userInterfaces';
import UserInfoSchema from '../../util/database/schemas/users/userInfoSchema';
import mongoose from 'mongoose';

const UserInfoModel = mongoose.model('UserInfo', UserInfoSchema);

export default class UserInfoHandler implements IUserInfo {
  id: string | ObjectId;
  userAuthId: string | ObjectId;
  firstName: string;
  lastName: string;
  mainGoal: string;
  basicInfo: IUserBasicInfo;

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, do not map
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  async save() {
    return await new UserInfoModel(this).save();
  }

  async update() {
    return await UserInfoModel.updateOne({ _id: this.id }, this);
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
