import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, User as UserModel } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  // READ (All)
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // READ (One)
  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  // UPDATE
  async update(id: number, dto: UpdateUserDto, currentUser: Omit<UserModel, 'password'>) {
    // Apenas Admins podem alterar o 'role' ou 'status' de outros usuários
    if ((dto.role || dto.status) && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem alterar papéis e status.');
    }

    // Usuários normais só podem editar seu próprio perfil
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new ForbiddenException('Você não tem permissão para editar este usuário.');
    }

    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });
    if (!userToUpdate) {
      throw new NotFoundException('Usuário a ser atualizado não encontrado.');
    }

    // Prepara os dados para a atualização
    const dataToUpdate: Prisma.UserUpdateInput = { ...dto };

    // Se uma nova senha for fornecida, faz o hash dela
    if (dto.password) {
      dataToUpdate.password = await bcrypt.hash(dto.password, 10);
    }

    // NOVO: Lógica para invalidar a sessão se o status for alterado para SUSPENDED
    if (dto.status === 'SUSPENDED') {
      dataToUpdate.refreshToken = null;
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate, // Usa o objeto de dados preparado
      select: { id: true, email: true, name: true, role: true, status: true },
    });
  }

  // DELETE
  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Usuário deletado com sucesso.' };
  }
}