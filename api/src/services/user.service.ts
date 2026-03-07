import * as userRepo from "../repositories/user.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { RegisterInput, LoginInput } from "../types/user.types";

export async function register(data: RegisterInput) {
    const existingUser = await userRepo.findUserByEmail(data.email);
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepo.createUser({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || "STUDENT",
    });

    return user;
}

export async function login(data: LoginInput) {
    const user = await userRepo.findUserByEmail(data.email);
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return token;
}

export async function getProfile(id: string) {
    const user = await userRepo.findUserById(id);
    if (!user) {
        throw new Error("User not found");
    }
    // Return profile without password
    const { password, ...profile } = user;
    return profile;
}
