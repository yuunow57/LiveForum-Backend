import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authservice: AuthService;
  let userservice: UserService;

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authservice = module.get<AuthService>(AuthService);
    userservice = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should validate user and return JWT token', async () => {
    const user = { id: 1, email: 'test@test.com', password: 'hashedpw' };

    mockUserService.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await authservice.login({
      email: 'test@test.com',
      password: '1234',
    });

    expect(result).toHaveProperty('accessToken');
    expect(mockJwtService.signAsync).toHaveBeenCalled();
  });
});
