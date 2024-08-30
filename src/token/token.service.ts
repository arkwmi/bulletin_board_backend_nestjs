import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { Public } from 'src/auth/auth.gurad';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  @Public()
  async getAllTokens(): Promise<Token[]> {
    return this.tokenRepository.find();
  }
}
