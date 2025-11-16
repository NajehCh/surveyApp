import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminService } from './admin.service';
import { beforeEach, describe } from 'node:test';

describe('AdminService', () => {
  let service: AdminService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      admin: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: 'PrismaService', useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('✅ devrait créer un admin si aucun admin n’existe', async () => {
    prismaMock.admin.findFirst.mockResolvedValue(null); // pas d’admin existant
    prismaMock.admin.create.mockResolvedValue({
      id: 1,
      name: 'Test',
      email: 'test@test.com',
      password: 'hashed',
    });

    const result = await service.createAdmin('Test', 'test@test.com', 'password123');

    expect(prismaMock.admin.findFirst).toHaveBeenCalled();
    expect(prismaMock.admin.create).toHaveBeenCalledWith({
      data: {
        name: 'Test',
        email: 'test@test.com',
        password: expect.any(String), // mot de passe hashé
      },
    });
    expect(result).toHaveProperty('id', 1);
  });

  it('❌ devrait lancer une ConflictException si un admin existe déjà', async () => {
    prismaMock.admin.findFirst.mockResolvedValue({ id: 1, name: 'Exist' });

    await expect(
      service.createAdmin('Test', 'test@test.com', 'password123'),
    ).rejects.toThrow(ConflictException);
  });

  it('🔑 devrait hasher le mot de passe avant la création', async () => {
    prismaMock.admin.findFirst.mockResolvedValue(null);
    prismaMock.admin.create.mockImplementation(({ data }) => data);

    const result = await service.createAdmin('Test', 'test@test.com', 'password123');

    expect(await bcrypt.compare('password123', result.password)).toBe(true); // vérifie que le hash correspond
  });
});
