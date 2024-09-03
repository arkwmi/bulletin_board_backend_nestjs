import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../token/token.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;

  const mockTokenRepository = {
    findOneBy: jest.fn(),
  };

  const tokenString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Token),
          useValue: mockTokenRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt-token'),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'EMAIL_USER':
                  return 'test@example.com';
                case 'EMAIL_PASS':
                  return 'password';
                case 'FRONTEND_BASE_URL':
                  return 'http://localhost:3000';
              }
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateToken', () => {
    it('成功', async () => {
      const tokenEntity = new Token();
      tokenEntity.temporaryToken = tokenString;
      tokenEntity.expirationDate = new Date(Date.now() + 10000);
      tokenEntity.userId = 1;

      mockTokenRepository.findOneBy.mockResolvedValue(tokenEntity);
      const result = await authService.validateToken(tokenString);
      expect(result).toEqual({ valid: true, userId: tokenEntity.userId });
    });

    it('トークンが見つからない場合', async () => {
      mockTokenRepository.findOneBy.mockResolvedValue(null);
      await expect(authService.validateToken('invalid-token')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('トークンが有効期限切れの場合', async () => {
      const tokenEntity = new Token();
      tokenEntity.temporaryToken = tokenString;
      tokenEntity.expirationDate = new Date(Date.now() - 10000);

      mockTokenRepository.findOneBy.mockResolvedValue(tokenEntity);
      await expect(authService.validateToken(tokenString)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
