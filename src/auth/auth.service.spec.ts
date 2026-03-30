import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Role } from '@prisma/client';

import { AuthService } from './auth.service';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));
import { PrismaService } from 'src/prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let config: ConfigService;
  let jwt: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@mre.com',
    hash: 'hashed-password',
    role: Role.AGENT,
    environmentId: null,
    firstname: null,
    lastname: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    config = module.get<ConfigService>(ConfigService);
    jwt = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create user and return access token', async () => {
      const signupInput = {
        email: 'test@mre.com',
        password: '123456',
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser as never);

      const result = await service.signup(signupInput);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: signupInput.email,
          hash: 'hashed-password',
        },
      });
      expect(jwt.signAsync).toHaveBeenCalledWith(
        { sub: mockUser.id, email: mockUser.email },
        {
          expiresIn: '15m',
          secret: 'test-secret',
        },
      );
      expect(result).toEqual({
        accessToken: 'mock-token',
        user: mockUser,
      });
    });

    it('should throw ForbiddenException when credentials are taken', async () => {
      const signupInput = {
        email: 'test@mre.com',
        password: '123456',
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      jest.spyOn(prisma.user, 'create').mockRejectedValue({ code: 'P2002' });

      await expect(service.signup(signupInput)).rejects.toThrow(
        new ForbiddenException('Credentials taken'),
      );
    });
  });

  describe('signin', () => {
    it('should throw ForbiddenException when user does not exist', async () => {
      const signinInput = {
        email: 'unknown@mre.com',
        password: '123456',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.signin(signinInput)).rejects.toThrow(
        new ForbiddenException('Invalid credentials'),
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const signinInput = {
        email: 'test@mre.com',
        password: 'wrong-pass',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as never);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.signin(signinInput)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should return token and user when credentials are valid', async () => {
      const signinInput = {
        email: 'test@mre.com',
        password: '123456',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as never);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.signin(signinInput);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: signinInput.email },
      });
      expect(result).toEqual({
        accessToken: 'mock-token',
        user: mockUser,
      });
    });
  });

  describe('singinToken', () => {
    it('should throw if JWT secret is missing', async () => {
      jest.spyOn(config, 'get').mockReturnValueOnce(undefined);

      await expect(service.singinToken(1, 'test@mre.com')).rejects.toThrow(
        'JWT secret is not defined',
      );
    });
  });
});
