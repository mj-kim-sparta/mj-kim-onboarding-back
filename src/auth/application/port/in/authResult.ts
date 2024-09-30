import { TokensDto } from "./tokensDto";

export class AuthResult {
    public result: string;
    public message: string;
    public tokens?: TokensDto | null;
}