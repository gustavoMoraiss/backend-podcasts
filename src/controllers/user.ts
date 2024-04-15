import { CreateUser } from "#/@types/user";
import emailVerificationToken from "#/models/emailVerificationToken";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
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

    const token = generateToken()
    const verificationToken = await emailVerificationToken.create({
        owner: (await user)._id,
        token
    });

    transport.sendMail({
        to: (await user)?.email,
        from: "auth@podify.com",
        html: `<h1>Your verification token is: ${token}</h1>`
    });

    res.status(201).json(user);
}