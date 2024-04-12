import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { CreateuserSchema } from "#/utils/validationSchema";
import { MAILTRAP_PASSWORD, MAILTRAP_USER } from "#/utils/variables";
import { RequestHandler } from "express";
import nodemailer from 'nodemailer';

export const createUser: RequestHandler = async (req: CreateUser, res) => {
    const { email, password, name } = req.body;
    const user = User.create({ name, email, password });


    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: MAILTRAP_USER,
            pass: MAILTRAP_PASSWORD
        }
    });

    transport.sendMail({
        to: (await user)?.email,
        from: "auth@podify.com",
        html: "<h1>chambraaaaa</h1>"
    });

    res.status(201).json(user);
}