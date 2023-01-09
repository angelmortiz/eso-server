import { ObjectId } from 'mongodb';
import { IUser } from '../../util/interfaces/userInterfaces';
import UserAuthSchema from '../../util/database/schemas/users/userAuthSchema';
import mongoose from 'mongoose';

const UserAuthModel = mongoose.model('UserAuth', UserAuthSchema);

export default class UserAuthHandler implements IUser {
  _id: string | ObjectId;
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

  save() {
    return new UserAuthModel(this)
      .save()
      .then((result) => {
        console.log('New document inserted successfully.');
        return result._id.toString();
      })
      .catch((error) => {
        console.log('There was an error trying to insert new document.', error);
        return error;
      });
  }

  update() {
    return UserAuthModel
    .updateOne({_id: this._id}, this)
    .then((result) => {
      console.log('Document updated successfully.', result);
      return result;
    })
    .catch((error) => {
      console.log('There was an error trying to update the document.', error);
      return error;
    });
  }

  static fetchById(id: string | ObjectId) {
    return UserAuthModel
    .findById(id)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  static fetchByEmail(email: string) {
    return UserAuthModel
    .findOne({email})
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  static fetchByResetToken(passwordResetToken: string) {
    return UserAuthModel
    .findOne({passwordResetToken})
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  static deleteById(id: string | ObjectId) {
    return UserAuthModel
    .findByIdAndDelete(id)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }
}


