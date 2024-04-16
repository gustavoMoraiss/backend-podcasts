import { Request } from "express";

export interface CreateUserRequest extends Request {
    body: {
        name: string,
        password: string,
        email: string,
    }
}

export interface VerifyEmailRequest extends Request {
    body: {
        token: string,
        userId: string,
    }
}