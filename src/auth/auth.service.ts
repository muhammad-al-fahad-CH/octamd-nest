import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose"
import { User } from 'src/entities/user.entities';
import * as bcrypt from 'bcrypt';
import { AuthHelper } from './authHelper';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly loginModel: Model<User>,
    private authHelper: AuthHelper
) {}

 login(email?: string, password?: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const findAdmin = await this.loginModel.find({});
      if(findAdmin.length < 1 || findAdmin === null) {
        const hashPassword = await bcrypt.hash('admin', 10);
        const newLogin = await this.loginModel.create({email: 'admin@gmail.com', password: hashPassword});
        const result = await newLogin.save()
        const payload = {_id: result._id, email: result.email}
        return resolve({
          admin: {
            email: result.email,
          },
          token: this.authHelper.token(payload)
        })
      } else {
        const admin = await this.loginModel.findOne({ email });
        if(!admin) return resolve(new Error('email is incorrect'));

        const validatePassword = await bcrypt.compare(password, admin.password);
        if(!validatePassword) return resolve(new Error('password is incorrect'));

        const payload = {_id: admin._id, email: admin.email}
        return resolve({
          admin: {
            id: admin._id,
            email: admin.email,
          },
          token: this.authHelper.token(payload)
        })
      }
    })
 }
}