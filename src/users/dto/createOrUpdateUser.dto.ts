export class CreateOrUpdateUserDto {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  assignedParkId: number;
}
