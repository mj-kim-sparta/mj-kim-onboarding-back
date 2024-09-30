import { ApiProperty } from "@nestjs/swagger";

export class LogoutDto {
    @ApiProperty()
    public email: string;
}