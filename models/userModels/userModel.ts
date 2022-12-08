import { ObjectId } from 'mongodb';
import { IUser } from '../../util/interfaces/userInterfaces';
import { usersDb } from '../../util/database/connection';
import UserSchema from '../../util/database/schemas/users/userSchema';

const UserModel = usersDb.model('User', UserSchema);

export default class UserHandler implements IUser {
  id: string | ObjectId;
  name: string;
  email: string;
  password: string;
  imageLink: string;

  constructor(inputValues) {
    if (!inputValues) return; //if no values were provided, do not map
    this.mapValues(inputValues);
  }

  mapValues(inputValues) {
    Object.keys(inputValues).map((key) => (this[key] = inputValues[key]));
  }

  save() {
    return new UserModel(this)
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
    return UserModel
    .updateOne({_id: this.id}, this)
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
    return UserModel
    .findById(id)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  static deleteById(id: string | ObjectId) {
    return UserModel
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


