import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { Role, User } from '@prisma/client';

type AuthUser = Pick<User, 'role' | 'environmentId'>;

const makeAuthUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  role: Role.SUPER_ADMIN,
  environmentId: null,
  ...overrides,
});

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            environment: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a user successfully as SUPER_ADMIN', async () => {
      const createDto = { email: 'test@mre.com', password: '123456', environmentId: 1 };
      const superUser = makeAuthUser({ role: Role.SUPER_ADMIN });
      const mockCreatedUser = { id: 1, email: 'test@mre.com', role: Role.AGENT, environmentId: 1 };
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockCreatedUser as any);

      const result = await service.create(createDto, superUser as User);

      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw ForbiddenException when ADMIN tries to create another ADMIN', async () => {
      const createDto = {
        email: 'test@mre.com',
        password: '123456',
        environmentId: 1,
        role: Role.ADMIN,
      };
      const superUser = makeAuthUser({ role: Role.ADMIN, environmentId: 2 });

      await expect(service.create(createDto, superUser as User)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      );
    });

    it('should use ADMIN own environmentId when creating a user as ADMIN', async () => {
      const createDto = { email: 'test@mre.com', password: '123456', role: Role.AGENT };
      const superUser = makeAuthUser({ role: Role.ADMIN, environmentId: 5 });
      const mockCreatedUser = { id: 2, email: 'test@mre.com', role: Role.AGENT, environmentId: 5 };
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockCreatedUser as any);

      const result = await service.create(createDto, superUser as User);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ environmentId: 5 }),
        }),
      );
      expect(result).toEqual(mockCreatedUser);
    });
  });
});
