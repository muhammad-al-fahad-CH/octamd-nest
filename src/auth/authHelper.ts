import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { auth } from "src/types/auth";
@Injectable()
export class AuthHelper {
  constructor(private jwtService: JwtService) {}

  token(user: auth): string {
    const payload = {
      id: user.id,
      email: user.email
    };
    return this.jwtService.sign(payload);
  }
}