import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,

  ) {}

  async createAdmin(name: string, email: string, password: string) {
    // Vérifier si un admin existe déjà
    const existingAdmin = await this.prisma.admin.findFirst();

    if (existingAdmin) {
      throw new ConflictException('Un seul administrateur est autorisé dans le système');
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du premier (et seul) admin
    return this.prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  
  }


  async loginAdmin(email: string, password: string) {
    const admin = await this.authService.validateAdmin(email,password);
    if (!admin) {
      throw new Error('Admin non trouvé ou mot de passe incorrect');
    }
    const {access_token} = await this.authService.login(admin);
    return {
      access_token,
      admin: {
        id_admin: admin.id_admin,
        name: admin.name,
        email: admin.email,
      },
    };
  }
}
