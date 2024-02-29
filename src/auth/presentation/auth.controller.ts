import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from "@nestjs/common";
import { IAuthService } from "../application/auth.service.interface";
import { SignInDto } from "../dto/signIn.dto";

@Controller("auth")
export class AuthController {
  constructor(@Inject("IAuthService") private readonly authService: IAuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(@Body() signInDto: SignInDto): Promise<any> {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }
}
