export interface IAuthService {
  signIn(email: string, password: string): Promise<{ access_token: string }>;
}
