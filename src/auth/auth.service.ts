import { Injectable } from '@nestjs/common';
import { User } from 'src/datasource/entities/user.entities';
import { AuthHelper } from './authHelper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly loginModel: Repository<User>,
    private authHelper: AuthHelper
) {}

 login(email?: string, password?: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const findAdmin = await this.loginModel.find({});
      if(findAdmin.length < 1 || findAdmin === null) {
        const hashPassword = await bcrypt.hash('admin', 10);
        const newLogin = this.loginModel.create({email: 'admin@gmail.com', password: hashPassword});
        const result = await this.loginModel.save(newLogin);
        const payload = {id: result.id, email: result.email}
        return resolve({
          admin: {
            email: result.email,
          },
          token: this.authHelper.token(payload)
        })
      } else {
        const admin = await this.loginModel.findOne({ where: { email } });
        if(!admin) return resolve(new Error('email is incorrect'));

        const validatePassword = await bcrypt.compare(password, admin.password);
        if(!validatePassword) return resolve(new Error('password is incorrect'));

        const payload = {id: admin.id, email: admin.email}
        return resolve({
          admin: {
            id: admin.id,
            email: admin.email,
          },
          token: this.authHelper.token(payload)
        })
      }
    })
 }
}