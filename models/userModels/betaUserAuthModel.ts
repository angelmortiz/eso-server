import { ObjectId } from 'mongodb';
import { IBetaUserAuth } from '../../util/interfaces/userInterfaces';
import BetaUserAuthSchema from '../../util/database/schemas/users/betaUserAuthSchema';
import mongoose from 'mongoose';

const BetaUserAuthModel = mongoose.model('BetaUserAuth', BetaUserAuthSchema);

export default class BetaUserAuthHandler {
  static async save(user: IBetaUserAuth): Promise<any> {
    return await new BetaUserAuthModel(user).save();
  }

  static async update(_id: string | ObjectId, user: IBetaUserAuth) {
    return await BetaUserAuthModel.updateOne({ _id }, user);
  }

  static async fetchByEmail(email: string): Promise<any> {
    return await BetaUserAuthModel.findOne({ email });
  }

  static async fetchByCode(code: string): Promise<IBetaUserAuth | null> {
    return await BetaUserAuthModel.findOne({ code });
  }

  static async deleteById(id: string | ObjectId) {
    return await BetaUserAuthModel.findByIdAndDelete(id);
  }
}
