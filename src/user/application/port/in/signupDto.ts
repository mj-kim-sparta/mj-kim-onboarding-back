import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
    @ApiProperty()
    public email: string;
    @ApiProperty()
    public password: string;
}

export class SignupResultDto {
    public result: string;
    public message: string;
}