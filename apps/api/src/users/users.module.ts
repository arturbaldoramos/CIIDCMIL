import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule { }
