import { ApiProperty } from "@nestjs/swagger";
import { TokensDto } from "./tokensDto";

export class LoginDto {
    @ApiProperty()
    public email: string;
    @ApiProperty()
    public password: string;
}

export class LoginResultDto {
    public result: string;
    public message: string;
    public tokens: TokensDto | null;
}