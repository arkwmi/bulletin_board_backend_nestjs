import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('temp_register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.userService.tempRegister(createUserDto);
    return {
      message: '仮登録完了',
    };
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserId(@Param('id') id: string): Promise<User> {
    return this.userService.getUserId(parseInt(id, 10));
  }

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUser(parseInt(id, 10), userData);
  }
}
