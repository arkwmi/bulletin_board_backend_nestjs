import { Controller, Get } from '@nestjs/common';
import { TokenService } from './token.service';
import { Token } from './token.entity';

@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  async getAllTokens(): Promise<Token[]> {
    return this.tokenService.getAllTokens();
  }
}
