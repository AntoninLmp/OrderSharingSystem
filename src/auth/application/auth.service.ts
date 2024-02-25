import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { IUsersService } from "../../users/application/users.service.interface";
import { User } from "../../users/domain/user.entity";
import { IAuthService } from "./auth.service.interface";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject("IUsersService") private readonly usersService: IUsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<{ access_token: string }> {
    let user: User;
    try {
      user = await this.usersService.findByEmail(email);
    } catch (error) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
