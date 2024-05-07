import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../user/user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  // TODO: userRepositoryのモック必要
  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        nickname: 'testuser',
        password: 'password',
        register_completed_flg: true,
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(userData as any);

      const result = await userController.createUser(userData);

      expect(result).toEqual(userData);
    });
  });
});
