import { prisma } from "../config/database";

export async function createUser(data: any) {

    return prisma.user.create({
        data
    });
}

export async function findUserByEmail(email: string) {

    return prisma.user.findUnique({
        where: { email }
    });
}

export async function findUserById(id: string) {

    return prisma.user.findUnique({
        where: { id }
    });
}
