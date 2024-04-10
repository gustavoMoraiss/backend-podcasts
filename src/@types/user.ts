import { Request } from "express";

export interface CreateUser extends Request {
    body: {
        name: string,
        password: string,
        email: string,
    }
}