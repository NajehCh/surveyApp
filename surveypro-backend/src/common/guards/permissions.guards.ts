import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id_admin = request.user?.userId;

    if (!id_admin) {
      throw new ForbiddenException('Accès réservé aux admins'); // 👈 renvoie 403 clair
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id_admin },
    });

    if (!admin) {
      throw new ForbiddenException('Admin non trouvé'); // 👈 renvoie 403 clair
    }

    // on attache l'admin à la requête
    request.admin = admin;
    return true;
  }
}

