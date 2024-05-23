import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose"
import { Login } from 'src/entities/login.entities';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Login.name) private readonly loginModel: Model<Login>,
    private readonly jwtService: JwtService
) {}

 login(email?: string, password?: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const findAdmin = await this.loginModel.find({});
      if(findAdmin.length < 1 || findAdmin === null) {
        const hashPassword = await bcrypt.hash('admin', 10);
        const newLogin = await this.loginModel.create({email: 'admin@gmail.com', password: hashPassword});
        const result = await newLogin.save()
        const generateToken = this.jwtService.sign({ _id: result._id })
        return resolve({
          admin: {
            email: result.email,
          },
          token: generateToken
        })
      } else {
        const admin = await this.loginModel.findOne({email: email, password: password});
        if(!admin) return resolve(new Error('email / password incorrect. please enter right email / password'));
        const generateToken = this.jwtService.sign({ _id: admin._id })
        return resolve(generateToken)
      }
    })
 }
}