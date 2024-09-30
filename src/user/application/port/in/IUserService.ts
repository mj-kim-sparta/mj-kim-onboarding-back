import { SignupDto, SignupResultDto } from "./signupDto";

export interface IUserService {
  signup(signupDto: SignupDto): Promise<SignupResultDto>;
}